var sortField = "";
var listingNr = "";
var window_id = null;

function addParent(parent)
{
	var tmp = parent.replace(/^branch/, "");
	if (tmp != "User" && tmp != "Customer" && tmp != "Country" && tmp != "TK" && tmp != "" && tmp != "null" && tmp != "root")
	{
		return "&parent=" + tmp;
	}                                                                                                                 
	return "";
}

function didChildClose()
{
	try
	{
		if (window_id && !window_id.name)
			throw "just_closed"
	}
	catch (e)
	{
		if (e == "just_closed")
		{
			this.location.reload();
			window_id = null;
		}
	}
}

function reloadOpener()
{
	//	alert('I was here!');
	top.opener.location.reload();
	top.close();
}

function doAction(action, data, pars)
{
	var listing_limit = getListings("")[getListings("").length - 1];
	if (listing_limit == undefined || listing_limit == "") listing_limit = data;
	if (listing_limit != undefined)
		listingNr = listing_limit.split(";")[0];

	//Hide context menu
	var menu = "";
	try
	{
		menu = document.getElementById("contextMenu").id;
		showHideContextMenu("none", menu);
	}
	catch(e)
	{
	}
	try
	{
		menu = document.getElementById("stylesContextMenu").id;
		showHideContextMenu("none", menu);
	}
	catch(e)
	{
	}
	try
	{
		menu = document.getElementById("contextMenuTree").id;
		showHideContextMenu("none", menu);
	}
	catch(e)
	{
	}

	switch (action)
		{
		case "detail":
			window_id = window.open("/idhtml/detail/overview_red.jsp?listing=" + listingNr, "detail", "width=1022, height=680, status=no, toolbar=no, menubar=no, location=no, resizable=yes, left=10, top=10");
			window_id.focus();
			break;
		case "analyse_screener":
			window_id = window.open("/idhtml/analysis/analyse_red.jsp?listing=" + listingNr, "analyse", "width=1022, height=680, status=no, toolbar=no, menubar=no, location=no, resizable=yes, left=10, top=10");
			window_id.focus();
			break;
		case "analyse_hemscott":
			window_id = window.open("/idhtml/analysis/hemscott_red.jsp?listing=" + listingNr, "analyse", "width=1022, height=680, status=no, toolbar=no, menubar=no, location=no, resizable=yes, left=10, top=10");
			window_id.focus();
			break;
		case "analyse_infinancials":
			window_id = window.open("/idhtml/analysis/infinancials_red.jsp?listing=" + listingNr, "analyse", "width=1022, height=680, status=no, toolbar=no, menubar=no, location=no, resizable=yes, left=10, top=10");
			window_id.focus();
			break;
		case "toUserpage":
			ypos = (screen.height - 200) / 2;
			xpos = (screen.width - 500) / 2;
			if (this.location.href.match("userpage") != null)
			{
				window_id = window.open("/idhtml/listing/add_to_userpage.jsp?listings=" + data, "addToUserpage", "width=400, height=420, status=no, toolbar=no, menubar=no, location=no, scrollbars=yes, resizable=yes, left=" + xpos + ", top=" + ypos);
			}
			else
			{
				window_id = window.open("/idhtml/listing/add_to_userpage.jsp?listings=" + getListings("string"), "addToUserpage", "width=400, height=420, status=no, toolbar=no, menubar=no, location=no, scrollbars=yes, resizable=yes, left=" + xpos + ", top=" + ypos);
			}
			window_id.focus();
			break;
		case "toPortfolio":
			ypos = (screen.height - 370) / 2;
			xpos = (screen.width - 460) / 2;
			var pos = data;
			var listings = getListings("");
			if (listings.length > 1)
			{
				window_id = window.open("/idhtml/portfolio/add_to_portfolio_multiple.jsp?listing=" + getListings("string"), "addToPortfolio", "width=460, height=150, status=no, toolbar=no, menubar=no, location=no, resizable=no, left=" + xpos + ", top=" + ypos);
			}
			else
			{
				window_id = window.open("/idhtml/portfolio/add_to_portfolio.jsp?listing=" + getListings("string"), "addToPortfolio", "width=460, height=370, status=no, toolbar=no, menubar=no, location=no, resizable=no, left=" + xpos + ", top=" + ypos);
			}
			window_id.focus();
			break;


		case "renameList":
			var answer = window.prompt(data);
			if (answer == null) return;

			var oldName = "";
			var oldId = "";
			var parent;
			var owner;
			var cmos;
			var cmo;

		//Search for List
			var divs = document.getElementsByTagName("div");
			for (var i = 0; i < divs.length; i++)
			{
				if (divs[i].className == "leaf_link_selected" || divs[i].className == "leaf_selected")
				{
					owner = divs[i].title;
					oldId = divs[i].id;
					oldName = divs[i].firstChild.nodeValue;
					parent = divs[i].parentNode.id;
					break;
				}
			}
			try
			{
				cmos = owner.split(";");
				cmo = cmos[cmos.length - 1];
				menu = document.getElementById("contextMenuTreeLeaf_" + cmo).id;
				showHideContextMenu("none", menu);
			}
			catch(e)
			{
			}
			var url = "/idhtml/jspAction/renameListingList/idhtml/listing/navigation.jsp?list=" + encodeURIComponent(oldId) + "&newName=" + encodeURIComponent(answer) + "&owner=" + cmo + addParent(parent);

			var pageTitle = top.frames[4].document.getElementById("pageTitle");
			if (pageTitle != null && trim(pageTitle.firstChild.nodeValue) == trim(oldName))
			{
				pageTitle.firstChild.nodeValue = answer;
			}
			//		 alert(url);
			sendRequest(url);
			break;


		case "renameFolder":
			var answer = window.prompt(data);
			if (answer == null) return;

			//Search for Folder
			var tds = document.getElementsByTagName("td");
			var owner;
			var oldName = "";
			var parent;
			for (var i = 0; i < tds.length; i++)
			{
				if (tds[i].className == "root_selected")
				{
					owner = tds[i].title;
					oldName = tds[i].parentNode.id;
					parent = tds[i].id;
					break;
				}
			}
			try
			{
				menu = document.getElementById("contextMenuTreeFolder_" + owner).id;
				showHideContextMenu("none", menu);
			}
			catch(e)
			{
			}

			if (oldName == "User" || oldName == "Customer" || oldName == "Country" || oldName == "TK")
			{
				return false;
			}

			var url = "/idhtml/jspAction/renameListingList/idhtml/listing/navigation.jsp?node=yes&list=" + encodeURIComponent(oldName) + "&newName=" + encodeURIComponent(answer) + "&owner=" + owner + addParent(parent);
			sendRequest(url);
			break;


		case "renameStyle":
			var answer = window.prompt(data);
			if (answer == null) return;

			var oldName = "";
			var divId = "";
			var parent;
			var owner;
			var cmos;
			var cmo;

		//Search for Style
			var divs = document.getElementsByTagName("div");
			for (var i = 0; i < divs.length; i++)
			{
				if (divs[i].className == "leaf_link_selected" || divs[i].className == "leaf_selected")
				{
					owner = divs[i].title;
					oldName = divs[i].id;
					divId = (divs[i].id.match(/^link/) != null) ? divs[i].id.split(";")[1] : divs[i].id;
					parent = divs[i].parentNode.id;
					break;
				}
			}
			try
			{
				cmos = owner.split(";");
				cmo = cmos[cmos.length - 1];
				menu = document.getElementById("contextMenuTreeLeaf_" + cmo).id;
				showHideContextMenu("none", menu);
			}
			catch(e)
			{
			}

			var url = "/idhtml/jspAction/";
			if (cmo == "List")
				url += "renameListStyle/idhtml/styles/styles.jsp?id=" + encodeURIComponent(divId) + "&newName=" + encodeURIComponent(answer) + "&owner=" + cmo + pars;
			else
				url += "renameStyle/idhtml/styles/styles.jsp?id=" + encodeURIComponent(oldName) + "&newName=" + encodeURIComponent(answer) + "&owner=" + cmo + addParent(parent);
			//alert(url);
			sendRequest(url);
			break;


		case "renameStyleFolder":
			var answer = window.prompt(data);
			if (answer == null) return;

			var oldName = "";
			var parent;
			var owner;

		//Search for folder
			var tds = document.getElementsByTagName("td");
			for (var i = 0; i < tds.length; i++)
			{
				if (tds[i].className == "root_selected")
				{
					owner = tds[i].title;
					oldName = tds[i].parentNode.id;
					parent = tds[i].id;
					break;
				}
			}
			try
			{
				menu = document.getElementById("contextMenuTreeFolder_" + owner).id;
				showHideContextMenu("none", menu);
			}
			catch(e)
			{
			}

			if (oldName == "User" || oldName == "Customer" || oldName == "Country" || oldName == "TK")
			{
				return false;
			}

			var url = "/idhtml/jspAction/renameStyle/idhtml/styles/styles.jsp?node=yes&id=" + encodeURIComponent(oldName) + "&newName=" + encodeURIComponent(answer) + "&owner=" + owner + addParent(parent);
			sendRequest(url);
			break;


		case "renamePreset":
			var answer = window.prompt(data);
			if (answer == null) return;

			var oldName = "";
			var parent;
			var owner;
			var lc;
			var cmos;
			var cmo;

			//Search for Preset
			var divs = document.getElementsByTagName("div");
			for (var i = 0; i < divs.length; i++)
			{
				if (divs[i].className == "leaf_link_selected" || divs[i].className == "leaf_selected")
				{
					owner = divs[i].title;
					oldName = divs[i].id;
					lc = divs[i].lang;
					parent = divs[i].parentNode.id;
					break;
				}
			}
			try
			{
				menu = document.getElementById("contextMenuTreeLeaf_" + owner).id;
				showHideContextMenu("none", menu);
			}
			catch(e)
			{
			}

			var url = "/idhtml/jspAction/modifyMDSObject/idhtml/news/presets.jsp?ns=newssearchsettings&key=" + encodeURIComponent(oldName) + "&name=" + encodeURIComponent(answer) + "&owner=" + owner + "&lc=" + lc + addParent(parent);
//			alert(url);
			sendRequest(url);
			break;

		case "renamePresetFolder":
			var answer = window.prompt(data);
			if (answer == null) return;

			var oldName = "";
			var parent;
			var owner;
			var lc;

			//Search for folder
			var tds = document.getElementsByTagName("td");
			for (var i = 0; i < tds.length; i++)
			{
				if (tds[i].className == "root_selected")
				{
					owner = tds[i].title;
					oldName = tds[i].parentNode.id;
					lc = tds[i].parentNode.lang;
					parent = tds[i].id;
					break;
				}
			}
			try
			{
				menu = document.getElementById("contextMenuTreeFolder_" + owner).id;
				showHideContextMenu("none", menu);
			}
			catch(e)
			{
			}

			if (oldName == "User" || oldName == "Customer" || oldName == "Country" || oldName == "TK")
			{
				return false;
			}

			var url = "/idhtml/jspAction/modifyMDSObject/idhtml/news/presets.jsp?ns=newssearchsettings&node=yes&key=" + encodeURIComponent(oldName) + "&name=" + encodeURIComponent(answer) + "&owner=" + owner + "&lc=" + lc + addParent(parent);
//			alert(url);
			sendRequest(url);
			break;


		case "removeList":
			var answer = window.confirm(data);
			if (!answer)
			{
				break;
			}

			//Remove a list
			var divs = document.getElementsByTagName("div");
			var divId = "";
			var owner;
			var cmos;
			var cmo;
			for (var i = 0; i < divs.length; i++)
			{
				if (divs[i].className == "leaf_link_selected" || divs[i].className == "leaf_selected")
				{
					owner = divs[i].title;
					found = true;
					divId = divs[i].id;
					var parent = divs[i].parentNode.id;
					break;
				}
			}
			try
			{
				cmos = owner.split(";");
				cmo = cmos[cmos.length - 1];
				menu = document.getElementById("contextMenuTreeLeaf_" + cmo).id;
				showHideContextMenu("none", menu);
			}
			catch(e)
			{
			}
			var url = "/idhtml/jspAction/removeListingList/idhtml/listing/navigation.jsp?list=" + encodeURIComponent(divId) + "&owner=" + cmo + addParent(parent);
			sendRequest(url);
			this.parent.frames[4].location = "/idhtml/blank.jsp";
			break;


		case "removeFolder":
			var answer = window.confirm(data);
			if (!answer)
			{
				break;
			}

			//Remove a folder
			var tds = document.getElementsByTagName("td");
			var tdId = "";
			var parent = "";
			var owner;
			for (var i = 0; i < tds.length; i++)
			{
				if (tds[i].className == "root_selected")
				{
					owner = tds[i].title;
					tdId = tds[i].parentNode.id;
					parent = tds[i].id;
					var url = "/idhtml/jspAction/removeListingList/idhtml/listing/navigation.jsp?node=yes&list=" + encodeURIComponent(tdId) + "&owner=" + owner + addParent(parent);
					break;
				}
			}
			try
			{
				menu = document.getElementById("contextMenuTreeFolder_" + owner).id;
				showHideContextMenu("none", menu);
			}
			catch(e)
			{
			}
			if (tdId != "User" && tdId != "Customer" && tdId != "Country" && tdId != "TK")
			{
				sendRequest(url);
			}
			break;


		case "setAsDefaultStyle":
			//Find style
			var divs = document.getElementsByTagName("div");
			var divId = "";
			var owner;
			var cmos;
			var cmo;

			for (var i = 0; i < divs.length; i++)
			{
				if (divs[i].className == "leaf_link_selected" || divs[i].className == "leaf_selected")
				{
					owner = (divs[i].title.match(/^link/) != null) ? divs[i].title.split(";")[1] : divs[i].title;
					divId = (divs[i].id.match(/^link/) != null) ? divs[i].id.split(";")[1] : divs[i].id;
					var parent = divs[i].parentNode.id;
					break;
				}
			}
			try
			{
				cmos = owner.split(";");
				cmo = cmos[cmos.length - 1];
				menu = document.getElementById("contextMenuTreeLeaf_" + cmo).id;
				showHideContextMenu("none", menu);
			}
			catch(e)
			{
			}
			var url = "/idhtml/jspAction/";
			if (cmo == "List")
			{
				url += "moveListStyle/idhtml/styles/styles.jsp?newPos=0&id=" + encodeURIComponent(divId) + "&owner=" + cmo + pars;
//				alert(url);
				sendRequest(url);
			}

			break;


		case "removeStyle":
			var answer = window.confirm(data);
			if (!answer)
			{
				break;
			}

			//Remove a style
			var divs = document.getElementsByTagName("div");
			var divId = "";
			var owner;
			var cmos;
			var cmo;

			for (var i = 0; i < divs.length; i++)
			{
				if (divs[i].className == "leaf_link_selected" || divs[i].className == "leaf_selected")
				{
					owner = (divs[i].title.match(/^link/) != null) ? divs[i].title.split(";")[1] : divs[i].title;
					divId = (divs[i].id.match(/^link/) != null) ? divs[i].id.split(";")[1] : divs[i].id;
					var parent = divs[i].parentNode.id;
					break;
				}
			}
			try
			{
				cmos = owner.split(";");
				cmo = cmos[cmos.length - 1];
				menu = document.getElementById("contextMenuTreeLeaf_" + cmo).id;
				showHideContextMenu("none", menu);
			}
			catch(e)
			{
			}
			var url = "/idhtml/jspAction/";
			if (cmo == "List")
				url += "removeListStyle/idhtml/styles/styles.jsp?id=" + encodeURIComponent(divId) + "&owner=" + cmo + pars;
			else
				url += "removeStyle/idhtml/styles/styles.jsp?id=" + encodeURIComponent(divId) + "&owner=" + cmo + addParent(parent);
			//alert(url);
			sendRequest(url);

			break;


		case "removeStyleFolder":
			var answer = window.confirm(data);
			if (!answer)
			{
				break;
			}

			//Remove a folder
			var owner;
			var tds = document.getElementsByTagName("td");
			var tdId = "";
			var parent = "";
			for (var i = 0; i < tds.length; i++)
			{
				if (tds[i].className == "root_selected")
				{
					owner = tds[i].title;
					tdId = tds[i].parentNode.id;
					parent = tds[i].id;
					var url = "/idhtml/jspAction/removeStyle/idhtml/styles/styles.jsp?node=yes&id=" + encodeURIComponent(tdId) + "&owner=" + owner + addParent(parent);
					break;
				}
			}
			try
			{
				menu = document.getElementById("contextMenuTreeFolder_" + owner).id;
				showHideContextMenu("none", menu);
			}
			catch(e)
			{
			}
			if (tdId != "User" && tdId != "Customer" && tdId != "Country" && tdId != "TK")
			{
				sendRequest(url);
			}
			break;


		case "removePreset":
			var answer = window.confirm(data);
			if (!answer)
			{
				break;
			}

			//Remove a preset
			var divs = document.getElementsByTagName("div");
			var divId = "";
			var owner;
			var parent;
			var lc;

			for (var i = 0; i < divs.length; i++)
			{
				if (divs[i].className == "leaf_link_selected" || divs[i].className == "leaf_selected")
				{
					owner = divs[i].title;
					divId = divs[i].id;
					parent = divs[i].parentNode.id;
					lc = divs[i].lang;
					break;
				}
			}
			try
			{
				menu = document.getElementById("contextMenuTreeLeaf_" + owner).id;
				showHideContextMenu("none", menu);
			}
			catch(e)
			{
			}
			var url = "/idhtml/jspAction/removeMDSObject/idhtml/news/presets.jsp?remove=yes&ns=newssearchsettings&key=" + encodeURIComponent(divId) + "&owner=" + owner + "&lc=" + lc + addParent(parent);
//			alert(url);
			sendRequest(url);

			break;


		case "removePresetFolder":
			var answer = window.confirm(data);
			if (!answer)
			{
				break;
			}

			//Remove a folder
			var owner;
			var tds = document.getElementsByTagName("td");
			var tdId = "";
			var parent = "";
			var lc;
			for (var i = 0; i < tds.length; i++)
			{
				if (tds[i].className == "root_selected")
				{
					owner = tds[i].title;
					tdId = tds[i].parentNode.id;
					parent = tds[i].id;
					lc = tds[i].parentNode.lang;
					var url = "/idhtml/jspAction/removeMDSObject/idhtml/news/presets.jsp?ns=newssearchsettings&node=yes&key=" + encodeURIComponent(tdId) + "&owner=" + owner + "&lc=" + lc + addParent(parent);
					break;
				}
			}
			try
			{
				menu = document.getElementById("contextMenuTreeFolder_" + owner).id;
				showHideContextMenu("none", menu);
			}
			catch(e)
			{
			}
			if (tdId != "User" && tdId != "Customer" && tdId != "Country" && tdId != "TK")
			{
//				alert(url);
				sendRequest(url);
			}
			break;


		case "addFolder":
			var answer = window.prompt(data);
			if (answer == null) return;

			var tds = document.getElementsByTagName("TD");
			for (i = 0; i < tds.length; i++)
			{
				if (tds[i].className == "root_selected")
				{
					var parent = tds[i].parentNode.id;
					var owner = tds[i].title;
					break;
				}
			}
			try
			{
				menu = document.getElementById("contextMenuTreeFolder_" + owner).id;
				showHideContextMenu("none", menu);
			}
			catch(e)
			{
			}

			var url = "/idhtml/jspAction/addListingList/idhtml/listing/navigation.jsp?name=" + encodeURIComponent(answer) + "&node=yes&owner=" + owner + addParent(parent);
		//		alert(url);
			this.document.location = url;
			break;


		case "addList":
			var answer = window.prompt(data);
			if (answer == null) return;
			var list = createListId(answer);

		//Search selected folder
			var folderId = "";
			var owner;
			var tds = document.getElementsByTagName("TD");
			for (i = 0; i < tds.length; i++)
			{
				if (tds[i].className == "root_selected")
				{
					parent = tds[i].parentNode.id;
					owner = tds[i].title;
					break;
				}
			}
			try
			{
				menu = document.getElementById("contextMenuTreeFolder_" + owner).id;
				showHideContextMenu("none", menu);
			}
			catch(e)
			{
			}
			var url = "/idhtml/jspAction/addListingList/idhtml/listing/navigation.jsp?name=" + encodeURIComponent(answer) + "&owner=" + owner + addParent(parent);
		//		alert(url);
			sendRequest(url);
			break;


		case "addStyle":
			var answer = window.prompt(data);
			if (answer == null) return;

			//Search selected folder
			var folderId = "";
			var owner;
			var tds = document.getElementsByTagName("TD");
			for (i = 0; i < tds.length; i++)
			{
				if (tds[i].className == "root_selected")
				{
					parent = tds[i].parentNode.id;
					owner = tds[i].title;
					break;
				}
			}
			try
			{
				menu = document.getElementById("contextMenuTreeFolder_" + owner).id;
				showHideContextMenu("none", menu);
			}
			catch(e)
			{
			}
			var url = "/idhtml/jspAction/";
			if (owner == "List")
				url += "addListStyle/idhtml/styles/styles.jsp?fields=M-1-v&name=" + encodeURIComponent(answer) + "&owner=" + owner + pars;
			else
				url += "addStyle/idhtml/styles/styles.jsp?fields=M-1-v&name=" + encodeURIComponent(answer) + "&owner=" + owner + addParent(parent) + pars;
			sendRequest(url);
		//		window.setTimeout("this.location.reload();", 500);
			break;


		case "addStyleFolder":
			var answer = window.prompt(data);
			if (answer == null) return;

			var tds = document.getElementsByTagName("TD");
			for (i = 0; i < tds.length; i++)
			{
				if (tds[i].className == "root_selected")
				{
					var parent = tds[i].parentNode.id;
					var owner = tds[i].title;
					break;
				}
			}
			try
			{
				menu = document.getElementById("contextMenuTreeFolder_" + owner).id;
				showHideContextMenu("none", menu);
			}
			catch(e)
			{
			}
			var url = "/idhtml/jspAction/addStyle/idhtml/styles/styles.jsp?style=M-1-v&name=" + encodeURIComponent(answer) + "&node=yes&owner=" + owner + addParent(parent);
		//		alert(url);
			sendRequest(url);
		//		window.setTimeout("this.location.reload();", 500);
			break;


		case "addPreset":
			var answer = window.prompt(data);
			if (answer == null)
				return;

			//Search selected folder
			var folderId = "";
			var owner;
			var lc;
			var tds = document.getElementsByTagName("TD");
			for (i = 0; i < tds.length; i++)
			{
				if (tds[i].className == "root_selected")
				{
					parent = tds[i].parentNode.id;
					owner = tds[i].title;
					lc = tds[i].parentNode.lang;
					break;
				}
			}
			try
			{
				menu = document.getElementById("contextMenuTreeFolder_" + owner).id;
				showHideContextMenu("none", menu);
			}
			catch(e)
			{
			}

			var url = "/idhtml/jspAction/setNewsPresets/idhtml/close.jsp?ns=newssearchsettings&name=" + encodeURIComponent(answer) + "&owner=" + owner + "&lc=" + lc + addParent(parent) + "&" + pars;
//			alert(url);
			sendRequest(url);
			break;


		case "savePreset":
			var url = "/idhtml/jspAction/setNewsPresets/idhtml/news/navigation.jsp?load=false&ns=newssearchsettings&key=" + selected_preset + "&name=" + encodeURIComponent(selected_preset_name) + "&owner=" + selected_preset_owner + "&lc=" + selected_preset_lc + "&" + pars + addParent(selected_preset_parent);
//			alert(url);
			sendRequest(url);
			break;


		case "addPresetFolder":
			var answer = window.prompt(data);
			if (answer == null) return;

			var tds = document.getElementsByTagName("TD");
			for (i = 0; i < tds.length; i++)
			{
				if (tds[i].className == "root_selected")
				{
					var parent = tds[i].parentNode.id;
					var owner = tds[i].title;
					break;
				}
			}
			try
			{
				menu = document.getElementById("contextMenuTreeFolder_" + owner).id;
				showHideContextMenu("none", menu);
			}
			catch(e)
			{
			}
			var url = "/idhtml/jspAction/setMDSObject/idhtml/news/presets.jsp?ns=newssearchsettings&name=" + encodeURIComponent(answer) + "&node=yes&owner=" + owner + addParent(parent);
//			alert(url);
			sendRequest(url);
			break;


		case "position":
			return;

			var divs = document.getElementsByTagName("div");
			var list = "";
			var name = "";
			var before = document.getElementById(data).name;
			var parent = (data.split(".").length > 1) ? data.split(".")[0] : "";
			var newList = "";
			var owner = "";

			for (var i = 0; i < divs.length; i++)
			{
				if (divs[i].className == "leaf_link_selected" || divs[i].className == "leaf_selected")
				{
					list = divs[i].id;
					name = list.split(".").pop();
					owner = divs[i].title;
					break;
				}
			}

			var url = "/idhtml/jspAction/renameListingList/idhtml/listing/navigation.jsp?list=" + encodeURIComponent(list) + "&before=" + before + "&owner=" + owner + addParent(parent);
			this.document.location = url;
		//		sendRequest(url);
		//var redirectPath = "/idhtml/set_list_name.jsp?path=/idhtml/listing/navigation.jsp&id=" + newList
		//window.setTimeout("this.parent.frames[2].location=" + redirectPath, 1000);
			break;


		case "show":
			var id;
			if (selectedItemTd != "")
			{
				sb("branch" + selectedItemTd);
				sf("folder" + selectedItemTd);
			}
			else
			{
				var owner = document.getElementById(selectedItemDiv).title;
				var list = selectedItemDiv.replace(/^link/, "");
				try
				{
					var cmos = owner.split(";");
					var cmo = cmos[cmos.length - 1];
					menu = document.getElementById("contextMenuTreeLeaf_" + cmo).id;
					showHideContextMenu("none", menu);
				}
				catch(e)
				{
				}
				sp("/idhtml/listing/display.jsp?list=" + encodeURIComponent(list) + "&owner=" + owner, document.getElementById(selectedItemDiv));
			}
			break;


		case "applyStyle":
//				  alert('applyStyle');
			var id;
			if (selectedItemTd != "")
			{
				sb("branch" + selectedItemTd);
				sf("folder" + selectedItemTd);
			}
			else
			{
				var el = document.getElementById(selectedItemDiv);
				var owner = el.title;
				var parent = el.attributes['name'].value;
				if (parent === undefined || parent == "none") parent = "root";
				//			alert("selectedItemDiv=" + selectedItemDiv + " owner=" + owner + " parent=" + parent);
				try
				{
					var cmids = selectedItemDiv.split(";");
					var cmid = cmids[0].replace(/^link/, "");
					var cmid2 = cmids[cmids.length - 1];
					var cmos = owner.split(";");
					var cmo = cmos[0];
					var cmo2 = cmos[cmos.length - 1];
					menu = document.getElementById("contextMenuTreeLeaf_" + cmo2).id;
					showHideContextMenu("none", menu);
				}
				catch(e)
				{
				}
				if (opener.document.location.href.match("add_listing_result"))
				{
					sp("/idhtml/search/add_listing_result.jsp?search_style=" + encodeURIComponent(cmid) + "&search_style_owner=" + cmo + "&search_style_parent=" + parent, el);
				}
				else if (opener.document.location.href.match("idscreen/arbitrage") != null)
				{
					var url = "/idhtml/idscreen/arbitrage.jsp?arbitrage_style=" + encodeURIComponent(cmid) + "&arbitrage_style_owner=" + cmo + "&arbitrage_style_parent=" + parent;
					opener.document.location.href = url;
				}
				else if (opener.document.location.href.match("arbitrage") != null)
				{
					var url = "/idhtml/detail/arbitrage.jsp?arbitrage_style=" + encodeURIComponent(cmid) + "&arbitrage_style_owner=" + cmo + "&arbitrage_style_parent=" + parent;
					opener.document.location.href = url;
				}
				else if (opener.document.location.href.match("idscreen/derivative") != null)
				{
					var url = "/idhtml/idscreen/derivative.jsp?derivate_style=" + encodeURIComponent(cmid) + "&derivate_style_owner=" + cmo + "&derivate_style_parent=" + parent;
					opener.document.location.href = url;
				}
				else if (opener.document.location.href.match("derivative") != null)
				{
					var url = "/idhtml/detail/derivative.jsp?derivate_style=" + encodeURIComponent(cmid) + "&derivate_style_owner=" + cmo + "&derivate_style_parent=" + parent;
					opener.document.location.href = url;
				}
				else if (opener.document.location.href.match("result"))
				{
					sp("/idhtml/search/result.jsp?search_style=" + encodeURIComponent(cmid) + "&search_style_owner=" + cmo + "&search_style_parent=" + parent, el);
				}
				else if (opener.document.location.href.match("setup"))
				{
					var url = "/idhtml/setup/style.jsp?style=" + encodeURIComponent(encodeURIComponent(cmid)) + "&styles_owner=" + cmo + "&list_style_parent=" + parent;
					if (cmo == "List")
						url += pars;
//					alert(url);
					sp(url, el);
				}
				else if (opener.document.location.href.match("listing"))
				{
					var url = "/idhtml/listing/display.jsp?list_style=" + encodeURIComponent(cmid) + "&list_style_owner=" + cmo + "&change_list=1&list_style_parent=" + parent;
					if (cmo == "List")
						url += pars;
					//alert(url);
					sp(url, el);
				}
			}
			break;


		case "applyPreset":
			var id;
			if (selectedItemTd != "")
			{
				sb("branch" + selectedItemTd);
				sf("folder" + selectedItemTd);
			}
			else
			{
				var el = document.getElementById(selectedItemDiv);
				var owner = el.title;
				var lc = el.lang;
				var name = el.firstChild.data;
				var parent = el.attributes['name'].value;
				if (parent === undefined || parent == "none")
					parent = "root";
				try
				{
					var cmos = owner.split(";");
					var cmo = cmos[cmos.length - 1];
					menu = document.getElementById("contextMenuTreeLeaf_" + cmo).id;
					showHideContextMenu("none", menu);
				}
				catch(e)
				{
				}
				var url = "/idhtml/news/set_preset_vars.jsp?preset=" + encodeURIComponent(selectedItemDiv) + "&preset_owner=" + owner + "&preset_parent=" + parent + "&preset_name=" + name + "&preset_lc=" + lc;
//				alert(url);
				document.location.href = url;
			}
			break;


		case "sortAsc":
			if (document.location.href.match("listing") != null)
			{
				var url = "/idhtml/listing/display.jsp?sort=" + sortField + "&order=asc" + "&list_style=" + selected_list_style + "&list_style_owner=" + selected_list_style_owner + "&list_style_parent=" + selected_list_style_parent;
				//			  alert(url);
				document.location = url;
			}
			else
			{
				document.location = "/idhtml/screens/list_iframe.jsp?list=" + encodeURIComponent(listName) + "&sort=" + sortField + "&order=asc";
			}
			break;
		case "sortDesc":
			if (this.document.location.href.match("listing") != null)
			{
				var url = "/idhtml/listing/display.jsp?sort=" + sortField + "&order=desc" + "&list_style=" + selected_list_style + "&list_style_owner=" + selected_list_style_owner + "&list_style_parent=" + selected_list_style_parent;
				//			alert(url);
				document.location = url;
			}
			else
			{
				document.location = "/idhtml/screens/list_iframe.jsp?list=" + encodeURIComponent(listName) + "&sort=" + sortField + "&order=desc";
			}
			break;
		case "sortRemove":
			if (this.document.location.href.match("listing") != null)
			{
				document.location = "/idhtml/listing/display.jsp?list=" + encodeURIComponent(listName) + "&sort=none" + "&list_style=" + selected_list_style + "&list_style_owner=" + selected_list_style_owner + "&list_style_parent=" + selected_list_style_parent;
			}
			else
			{
				document.location = "/idhtml/screens/list_iframe.jsp?list=" + encodeURIComponent(listName);
			}
			break;


		case "editStyle":
			detai
			sendRequest(url)
			//		var command = "this.location = '/idhtml/setup/style.jsp?id=" + id + "&owner=user';";
			//		window.setTimeout(command, 1500);
			break;


		case "editTransaction":
			ypos = (screen.height - 400) / 2;
			xpos = (screen.width - 460) / 2;
			window_id = window.open("/idhtml/portfolio/edit_trans.jsp?" + data + "&transaction=" + getListings("")[getListings("").length - 1], "editPortfolio", "width=460, height=400, status=no, toolbar=no, menubar=no, location=no, resizable=no, left=" + xpos + ", top=" + ypos);
			window_id.focus();
		//		window_id.moveTo(xpos, ypos);
			break;

		case "removeListingListListing":
			var parent = this.parent.frames[2].document.getElementById(listName).parentNode.id.replace(/^branch/, "");
			if (parent == "User" || parent == "Customer" || parent == "country") parent = "";
			var path = "/idhtml/jspAction/removeListingListListing/idhtml/listing/display.jsp?listing=" + getListings("string") + "&list=" + encodeURIComponent(listName) + "&owner=" + data + "&parent=" + parent;
		//		removeListings();
			sendRequest(path);
			break;

		case "markListingForMove":
			moveSelection = lastSelection;
			rowIndexes = getMoveString();
			break;
		case "insertMarkedListingListListing":
			if (moveSelection > 0 && moveSelection != lastSelection)
			{
				var from = moveSelection - 1;
				var to = lastSelection - 1;
/*
				if (lastSelection < moveSelection)
					to--;
*/
//				var path = "/idhtml/jspAction/moveListingListListing/idhtml/listing/display.jsp?from=" + from + "&to=" + to + "&list=" + encodeURIComponent(listName) + "&owner=" + data;
				var path = "/idhtml/jspAction/moveListingListListing/idhtml/listing/display.jsp?from=" + rowIndexes + "&to=" + to + "&list=" + encodeURIComponent(listName) + "&owner=" + data;
				moveSelection = 0;
				sendRequest(path);
			}
			break;
		case "insertMarkedPortfolioListing":
			if (moveSelection > 0 && moveSelection != lastSelection)
			{
				var from = moveSelection - 1;
				var to = lastSelection - 1;
/*
				if (lastSelection < moveSelection)
					to--;
*/
				var path = "/idhtml/jspAction/movePortfolioListing/idhtml/portfolio/list.jsp?from=" + from + "&to=" + to + "&list=" + portfolioId + "&portfolioName=" + encodeURIComponent(portfolioName) + "&portfolioId=" + portfolioId;
				moveSelection = 0;
				sendRequest(path);
			}
			break;

		case "removePortfolioListing":
			path = data + "?listing=" + encodeURIComponent(getListings("string")) + "&list=" + encodeURIComponent(portfolioId);
		//		removeListings();
			this.location.href = path;
			break;
		case "transactions":
			path = "/idhtml/portfolio/trans.jsp?listing=" + listingNr + "&portfolioId=" + encodeURIComponent(portfolioId) + "&portfolioName=" + encodeURIComponent(portfolioName);
			document.location = path;
			break;

		case "toLimit":
			ypos = (screen.height - 540) / 2;
			xpos = (screen.width - 500) / 2;
			window_id = window.open("/idhtml/limit/add.jsp?listing=" + listingNr, "addLimit", "width=500, height=540, status=no, toolbar=no, menubar=no, location=no, resizable=no, left=" + xpos + ", top=" + ypos);
			window_id.focus();
		//		window_id.moveTo(xpos, ypos);
			break;
		case "removeLimit":
			var listings = getListings("");
			var lids = new Array;
			for (var i = 0; i < listings.length; i++)
			{
				lids.push(listings[i].split(";")[1]);
			}
			var url = data + "?lid=" + lids.join(";");
			sendRequest(url);
		//		removeListings();
			break;
		case "editLimit":
			var lid = listing_limit.split(";")[1];
			ypos = (screen.height - 420) / 2;
			xpos = (screen.width - 500) / 2;
			window_id = window.open("/idhtml/limit/edit.jsp?lid=" + lid, "editLimit", "width=500, height=540, status=no, toolbar=no, menubar=no, location=no, resizable=no, left=" + xpos + ", top=" + ypos);
			window_id.focus();
			break;
		case "addListing":
			var targetPos = document.getElementById(listingNr).rowIndex;
			window_id = window.open("/idhtml/search/add_listing.jsp?targetPos=" + targetPos, "addListing", "width=1022, height=680, status=no, toolbar=no, menubar=no, location=no, resizable=yes");
			window_id.focus();
			break;
		case "addListingToPos":
			var rows = top.opener.document.getElementById("list").rows;
			var targetRow;
			var pos;
			var listings = getListings("string");
			for (i = 1; i < rows.length; i++)
			{
				if (rows[i].className == "selected")
				{
					listingNr = top.opener.document.getElementById(rows[i].id).id;
					targetRow = top.opener.document.getElementById(listingNr);
					break;
				}
			}
			if (data == "after")
			{
				pos = targetRow.rowIndex;
			}
			else
			{
				pos = targetRow.rowIndex - 1;
			}
			var url;
			var topen = top.opener;
			if (topen.location.href.search("portfolio") > -1)
			{
				if (getListings().length > 1)
				{
					url = "/idhtml/jspAction/addPortfolioListing/idhtml/close.jsp?list=" + encodeURIComponent(topen.portfolioName) + "&listing=" + listings + "&to=" + pos;
					sendRequest(url);
					//				top.close();
				}
				else
				{
					ypos = (screen.height - 370) / 2;
					xpos = (screen.width - 460) / 2;
					topen.window_id = topen.window.open("/idhtml/portfolio/add_to_portfolio.jsp?portfolioId=" + encodeURIComponent(topen.portfolioId) + "&listing=" + getListings("string") + "&pos=" + pos, "addToPortfolio", "width=460, height=370, status=no, toolbar=no, menubar=no, location=no, resizable=no, left=" + xpos + ", top=" + ypos);
					top.close();
					topen.window_id.focus();
				}
			}
			else
			{
				if (topen.location.href.search("listing") > -1)
				{
					url = "/idhtml/jspAction/addListingListListing/idhtml/close_top.jsp?list=" + encodeURIComponent(topen.listName) + "&listing=" + listings + "&to=" + pos;
					sendRequest(url);
					//				top.window.setTimeout("this.opener.location.reload();this.close();", 750);
				}
			}
			break;
		case "showNews":
			window_id = window.open("/idhtml/detail/news_red.jsp?listing=" + listingNr, "detail", "width=1022, height=680, status=no, toolbar=no, menubar=no, location=no, resizable=no, left=10, top=10");
			window_id.focus();
			break;
		case "showTMSNews":
			window_id = window.open("/idhtml/detail/tms_news_red.jsp?listing=" + listingNr, "detail", "width=1022, height=680, status=no, toolbar=no, menubar=no, location=no, resizable=no, left=10, top=10");
			window_id.focus();
			break;
		case "showArbitrage":
			window_id = window.open("/idhtml/detail/arbitrage_red.jsp?listing=" + listingNr, "detail", "width=1022, height=680, status=no, toolbar=no, menubar=no, location=no, resizable=yes, left=10, top=10");
			window_id.focus();
			break;
		case "showChartYear":
			window_id = window.open("/idhtml/detail/chart_red.jsp?PERIOD=year1&listing=" + listingNr, "detail", "width=1022, height=680, status=no, toolbar=no, menubar=no, location=no, resizable=yes, left=10, top=10");
			window_id.focus();
			break;
		case "showChartToday":
			window_id = window.open("/idhtml/detail/chart_red.jsp?PERIOD=avail&listing=" + listingNr, "detail", "width=1022, height=680, status=no, toolbar=no, menubar=no, location=no, resizable=yes, left=10, top=10");
			window_id.focus();
			break;
		case "showTimeSales":
			window_id = window.open("/idhtml/detail/timesales_red.jsp?listing=" + listingNr, "detail", "width=1022, height=680, status=no, toolbar=no, menubar=no, location=no, resizable=yes, left=10, top=10");
			window_id.focus();
			break;
		case "showWarrants":
			window_id = window.open("/idhtml/detail/derivative_red.jsp?sc=M&cp=*&derivative_type=warrants&listing=" + listingNr, "detail", "width=1022, height=680, status=no, toolbar=no, menubar=no, location=no, resizable=yes, left=10, top=10");
			window_id.focus();
			break;
		case "showWarrantsCall":
			window_id = window.open("/idhtml/detail/derivative_red.jsp?sc=M&cp=1&derivative_type=warrants&listing=" + listingNr, "detail", "width=1022, height=680, status=no, toolbar=no, menubar=no, location=no, resizable=yes, left=10, top=10");
			window_id.focus();
			break;
		case "showWarrantsPut":
			window_id = window.open("/idhtml/detail/derivative_red.jsp?sc=M&cp=2&derivative_type=warrants&listing=" + listingNr, "detail", "width=1022, height=680, status=no, toolbar=no, menubar=no, location=no, resizable=yes, left=10, top=10");
			window_id.focus();
			break;
		case "showOptions":
			window_id = window.open("/idhtml/detail/derivative_red.jsp?sc=Z&cp=*&derivative_type=options&listing=" + listingNr, "detail", "width=1022, height=680, status=no, toolbar=no, menubar=no, location=no, resizable=yes, left=10, top=10");
			window_id.focus();
			break;
		case "showOptionsCall":
			window_id = window.open("/idhtml/detail/derivative_red.jsp?sc=Z&cp=1&derivative_type=options&listing=" + listingNr, "detail", "width=1022, height=680, status=no, toolbar=no, menubar=no, location=no, resizable=yes, left=10, top=10");
			window_id.focus();
			break;
		case "showOptionsPut":
			window_id = window.open("/idhtml/detail/derivative_red.jsp?sc=Z&cp=2&derivative_type=options&listing=" + listingNr, "detail", "width=1022, height=680, status=no, toolbar=no, menubar=no, location=no, resizable=yes, left=10, top=10");
			window_id.focus();
			break;
		case "showVDB":
			window_id = window.open("/idhtml/detail/vdb_red.jsp?listing=" + listingNr, "detail", "width=1022, height=680, status=no, toolbar=no, menubar=no, location=no, resizable=yes, left=10, top=10");
			window_id.focus();
			break;
		case "removeTransaction":
			var path = "/idhtml/jspAction/removePortfolioTransaction/idhtml/portfolio/list.jsp?" + data + "&transaction=" + getListings("string");
		//		removeListings();
			sendRequest(path);
			break;
	}
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








