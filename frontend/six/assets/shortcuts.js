
function processCommandLine(command, lc)
{
	// analyse the reg. expression of command line (note: "detailPageShortcuts()" call is done from "search"/"result.jsp" file)
	// *** shortcuts must be tested with "DWS inter" search-expression as well ***
	var params = command.match(/^((85,)|([.])|(\w[.\w\*\&\+\-\/]*,))(.*)$/);	// 6 parameters: 1 - header, 5 - rest of string (parameter 1/2/2&3)
	var header = (params == null) ? "fail" : params[1];					// get command header
	var param  = (params == null) ? "" : params[5].toLowerCase();			// get command body
	var vers   = "shortcuts version";								// constant 'shortcuts version' text

 	switch (header) {
		case "85,":
			if (param != "") { return showContributorPage(command); }		// Contributor Page 85 (or instrument ISIN "85," ?)
			break;										// return "command" - not a Contributor Page 85
		case ".":
			if (param == vers) { return showVersion(); }				// Short-Cuts Version
			return shortcuts(command, lc, command);						// List & News Display
		case "fail":
			return null;									// return NULL: not a valid short-cut expression
     		default:											// other cases: check if "detailPageShortcuts()" call !
			var items = param.match(/^(([\w\?\*]+)|((\w*),([a-zA-Z]+)))?$/);	// are these 'bourse code' & 'viewer page' items ?
			if ((items == null) && (param != "")) { return null; }		// return NULL if not a valid bourse code and/or viewer page								
	}
	return command; 
}

function showContributorPage(search)
{

	// all commands with regular expression: (85),(([\w&&[^\d]]*)([\d]*))?
	var params = search.match(/^(85),(([a-zA-Z]+)([\d]*))$/);	// search != NULL [search.split(",")]
	var fail   = (params == null);					// match() brings no result
	var name   = fail ? "" : params[1];
	var contr  = fail ? "" : params[2].toLowerCase();		// all regular expression are in lower case
	var symbol = fail ? "" : params[3].toUpperCase();		// all regular expression are in upper case
	var page   = fail ? "" : (params[4] == "") ? "65000" : params[4];		// contributor page, for example "22", or content page "65000"
	var type   = "";
	var ptsmi  = ".ptsmi";							// show SWX / Bank Leu / Pre Trade
	var cont   = ".?cont";							// contributor table code - #25
	var help   = ".?";							// help manual code
	var lc     = "en";							// help language code - always english
	var rvalue = "";								// function's return value (if empty - Ok)

	// *** all command strings should be sorted ***
	var names = [
			new Array(	"85",	"^e$",				"table"),
			new Array(	"85",	"^leuz10[0-2]$",			"instrlist"),
			new Array(	"85",	"^([a-zA-Z]+)([\\d]*)$",	"cpi")		// last array item w/o coma [test input: "85,jb22"]
              	];

 	for (var i = 0; i < names.length; i++) {
    		if (name == names[i][0]) {
      		if (contr.match(names[i][1]) != null) {			// check the regular expression from the table
        			type	= names[i][2];					// switch type is found
        			break;
      		}
    		}
  	}
 	switch (type) {
		case "cpi":									// test case: JBxx
			document.location.href= "/idhtml/listing/contributing_red.jsp?page=" + page + "&symbol=" + symbol + "&search_text="+encodeURIComponent(search);
			break;
		case "instrlist":
			shortcuts(ptsmi,lc,search);							// pre-trade smi code
			break;
 		case "table":
			shortcuts(cont,lc,search);							// show contributor table
			break;
  		default:									// failure -> short-cuts help screen [test input: "85,11"]	
			var yes = window.confirm("Short-Cut \"Contributor Query\"\n\nWarning:\nYour command \"" + search + "\" is wrong. Do you want to consult command lists in \"Short-Cuts Help\" ?");
			if (yes) { shortcuts(help, lc,""); } 				// get Help from SIX iD HTML on-line manual
	}
	return rvalue;									// function's return value
}
		
function detailPageShortcuts (listing, shortcut, gKey)
{
	// all commands with regular expression: (\w[\w.\*\&\+\-\/]*),(([\w\?\*]+)|((\w*),([[\w\?]&&[^\d]]+)))?
	listingNr   = listing;								// *** Global Var "listingNr" must be assigned ! ***
	var name    = (shortcut == "") ? "q" : shortcut.toLowerCase();	// shortcut != NULL and, if empty, == "Q" (action "detail" -> Single Quote page)
	var mainpar = "";
	var lastpar = "";
	var type    = "";
	var width   = "1022";								// pop-up window's width
	var height  = "680";								// pop-up window's height
	var wingui  = "width=" + width + ", height=" + height + ", status=no, toolbar=no, menubar=no, location=no, resizable=yes, left=10, top=10";	// window's GUI
	var help    = ".?";								// help manual code
	var lc	= "en";								// help language code - always english
	var rvalue  = "";									// function's return value (if empty - Ok)
	var styles  = new Array();							// array of slyles for different SC's search results

	// *** all command strings should be sorted ***
	styles["b"] = "M-1-v;NH-2-v;P-33,539,1-v;M-6-v;M-3-v;M-38-v;M-17-v;M-19-v;M-5-v;M-33-v";			// bond style			
	styles["e"] = "M-1-v;NH-2-v;P-33,539,1-v;M-6-v;M-3-v;M-38-v;M-17-v;M-19-v;M-5-v;M-33-v";			// equity style
	var eq = encodeURIComponent("sc=1;sc=A;sc=D;sc=G");

	var names = [
			new Array(	"ap",		"action",	"analyse_screener",						""),		// screener - analysis profile		
			new Array(	"b",		"search",	"sc=0;sc=2;sc=L;sc=V",	styles["b"]		),		// bonds		
			new Array(	"c",		"action",	"showChartYear",					""),
			new Array(	"ca",		"vdb",	"InstrumentAllCorporateActions",		""),
			new Array(	"co",		"action",	"showOptionsCall",				""),
			new Array(	"cw",		"action",	"showWarrantsCall",				""),
			new Array(	"div",	"vdb",	"InstrumentDividendsOverview",		""),
			new Array(	"e",		"search",	eq,	styles["e"]		),		// equities
			new Array(	"f",		"option",	"futures",						"sc=25"),
			new Array(	"fia",	"news",	"63505,107,",					""),		// news: company analyses, AWP FIA reports
			new Array(	"h",		"option",	"hybrids",						"sc=6"),
			new Array(	"ic",		"action",	"showChartToday",					""),
			new Array(	"id",		"vdb",	"InstrumentDetail",				""),
			new Array(	"io",		"action",	"detail",						""),		// Overview Instrument Viewer 
			new Array(	"is",		"vdb",	"InstrumentSummary",				""),
			new Array(	"l",		"action",	"toLimit",						""),
			new Array(	"n",		"news",	",0,",						""),		// news: all company news 
			new Array(	"na",		"news",	",107,",						""),		// news: all agencies company analyses
			new Array(	"np",		"news",	",120,",						""),		// news: all agencies company profiles
			new Array(	"o",		"action",	"showOptions",					""),
			new Array(	"po",		"action",	"showOptionsPut",					""),
			new Array(	"pw",		"action",	"showWarrantsPut",				""),
			new Array(	"q",		"action",	"detail",						""),
			new Array(	"ts",		"action",	"showTimeSales",					""),
			new Array(	"unp",	"news",	"63505,120,",					""),		// news: company portrait, AWP UNP reports
			new Array(	"w",		"action",	"showWarrants",					""),
			new Array(	"x",		"action",	"showArbitrage",					"")		// last array item w/o coma
			];

  	for (var i = 0; i < names.length; i++) {
    		if (name == names[i][0]) {
			type	  = names[i][1];			// switch type is given
			mainpar = names[i][2];			// type main parameter is given
			lastpar = names[i][3];			// type second parameter is given
			break;
    		}
  	}

 	switch (type) {
		case "action":					// perform special action -> function call
			doAction(mainpar,listingNr);
			break;
		case "news":					// news: agency code & topic code								
			var codes = mainpar.split(",");	// mainpar = "agency,topic[,language]"
			var news  = "&agency=" + codes[0] + "&topic=" + codes[1]; 
			window_id = window.open("/idhtml/detail/news_red.jsp?listing=" + listing + news, "detail", wingui);
			window_id.focus();
			break;
		case "option":					// search for derivative -> search call ?
			var option = mainpar + "&" + lastpar;
			window_id = window.open("/idhtml/detail/derivative_red.jsp?derivative_type=" + option + "&listing=" + listing, "detail", wingui);
			window_id.focus();
			break;
		case "search":					// search for security code -> search result call
			document.location.href = "/idhtml/search/display.jsp?search=" + encodeURIComponent(mainpar + ";U-GKey=" + gKey) + "&search_styles_owner=tk&search_style=" + encodeURIComponent(lastpar);
			break;
		case "vdb":						// get vdb data
			window_id = window.open("/idhtml/detail/vdb_red.jsp?VDBAction=" + mainpar + "&listing=" + listing, "detail", wingui);
			window_id.focus();
			break;
     		default:						// failure: short-cuts help screen !	
			var yes = window.confirm("Short-Cut \"Instrument Search\"\n\nWarning:\nYour command \"" + listing + "," + shortcut + "\" is wrong. Do you want to consult command lists in \"Short-Cuts Help\" ?");
			if (yes) { shortcuts(help, lc, ""); } 	// get Help from SIX iD HTML on-line manual
	}
	return rvalue;						// function's return value
}

function shortcuts(listing, lc, search_text)
{
	// all commands with regular expression: [.]([\w\?]\w*)
	var params  = listing.match(/^[.]([\w\?]\w*)$/);			// listing != NULL [listing.split(".")]
	var name    = (params == null) ? "" : params[1].toLowerCase();	// name: without '.' at the start
	var mainpar = "";
	var type    = "";
	var timeout = 2000;								// timeout in millisec. ?
	var help    = ".?";								// help manual code
	var rvalue = "";									// function's return value (if empty - Ok)

	// *** all command strings should be sorted ***
	var names = [
			new Array(	"aex",			"instrlist",	"Euronext Amsterdam.AEX Index Stocks"),
			new Array(	"afp",			"news",		"63509,,"),			
			new Array(	"afx",			"news",		"63512,,"),
			new Array(	"apa",			"news",		"63501,,"),
			new Array(	"asca",			"news",		"63502,,"),
			new Array(	"asx",			"instrlist",	"Sydney.ASX 100 Index Stocks"),
			new Array(	"atx",			"instrlist",	"Vienna.Indices ATX-Austrian Traded Index"),
			new Array(	"aud",			"instrlist",	"Foreign Exchange.AUD Forex"),
			new Array(	"awp",			"news",		"63505,,"),
			new Array(	"awpd",			"news",		"63505,,1"),
			new Array(	"awpf",			"news",		"63505,,2"),
			new Array(	"bel",			"instrlist",	"Euronext Bruxelles.BEL 20 Index Stocks"),
			new Array(	"bfn",			"news",		"63519,,"),						// News/Betten Beursmedia [Financial] News
			new Array(	"bondgovcall",		"search",		"cfi=dbftg*"),					// search DB with key CFI: call gov. bonds
			new Array(	"bondgovnoncall",		"search",		"cfi=dbftf*"),					// search DB with key CFI: non call gov. bonds
			new Array(	"bondzero",			"search",		"cfi=dbz*"),					// search DB with key CFI: zero bonds
			new Array(	"bondzerogov",		"search",		"cfi=dbzt*"),					// search DB with key CFI: government zero bonds
			new Array(	"cac",			"instrlist",	"Euronext Paris.CAC 40 Index Stocks"),
			new Array(	"cad",			"instrlist",	"Foreign Exchange.CAD Forex"),
			new Array(	"chf",			"instrlist",	"Foreign Exchange.CHF Forex"),
			new Array(	"dax",			"instrlist",	"Xetra.DAX Index Stocks"),
			new Array(	"dbf",			"news",		"63507,,"),						// News/DBF - Deutsche Boerse Frankfurt
			new Array(	"dj",				"instrlist",	"NYSE.DJ INDU Index Stocks"),
			new Array(	"djn",			"news",		"63510,,"),						// News/Dow Jones - Finwire News
			new Array(	"eur",			"instrlist",	"Foreign Exchange.EUR Forex"),
			new Array(	"euroxst50",		"instrlist",	"Major Index Stocks.DJ Euro Stoxx 50 Stocks"),
			new Array(	"fa",				"news",		",107,"),
			new Array(	"ftse",			"instrlist",	"London.FTSE 100 Index Stocks"),
			new Array(	"fxzh",			"instrlist",	"Foreign Exchange.Uniform Rates / Zuerich"),
			new Array(	"fundcom",			"search",		"cfi=euoic*"),					// search DB with key CFI: commodity funds
			new Array(	"fundderi",			"search",		"cfi=euoid*"),					// search DB with key CFI: derivative funds
			new Array(	"fundimmo",			"search",		"cfi=euoir*"),					// search DB with key CFI: real estate funds
			new Array(	"fundmix",			"search",		"cfi=euoim*"),					// search DB with key CFI: mixed funds
			new Array(	"futindex",			"search",		"cfi=fficsx"),					// search DB with key CFI: standard index futures
			new Array(	"futshares",		"search",		"cfi=ffspsx"),					// search DB with key CFI: standard shares financial futures
			new Array(	"gbp",			"instrlist",	"Foreign Exchange.GBP Forex"),
			new Array(	"hdax",			"instrlist",	"Xetra.HDAX 110 Index Stocks"),
			new Array(	"hkd",			"instrlist",	"Foreign Exchange.HKD Forex"),
			new Array(	"hsi",			"instrlist",	"Hongkong.Hang Seng Index Stocks"),
			new Array(	"ibex",			"instrlist",	"512316AB217AFE2BB53F96DBC9293A05"),
			new Array(	"jpy",			"instrlist",	"Foreign Exchange.JPY Forex"),
			new Array(	"klse",			"instrlist",	"Kuala Lumpur.KLSE Composite Index Stocks"),
			new Array(	"kyodo",			"news",		"63508,,"),
			new Array(	"luxx",			"instrlist",	"Luxemburg.Luxemburg Stocks"),
			new Array(	"mib",			"instrlist",	"Milano.Titoli MIB30"),
			new Array(	"n",				"newsviewer",	""),							// New Headlines Search
			new Array(	"n225",			"instrlist",	"Tokyo.Nikkei 225 Index Constituents"),	// the same as ".NIKKEI", request from TK Singapore
			new Array(	"nasdaq",			"instrlist",	"NASDAQ.NASDAQ 100 Index Stocks"),
			new Array(	"news",			"newsviewer",	""),							// New Headlines Search
			new Array(	"nikkei",			"instrlist",	"Tokyo.Nikkei 225 Index Constituents"),	// old short-cut for "Nikkei 225 Index Constituents"
			new Array(	"nok",			"instrlist",	"Foreign Exchange.NOK Forex"),
			new Array(	"ns",				"newsviewer",	""),
			new Array(	"nzd",			"instrlist",	"Foreign Exchange.NZD Forex"),
			new Array(	"psei",			"instrlist",	"Philippine SE Indices.PSEi"),
			new Array(	"ptsmi",			"instrlist",	"SWX.Bank Leu / Pre Trade"),
			new Array(	"sek",			"instrlist",	"Foreign Exchange.SEK Forex"),
			new Array(	"sensex",			"instrlist",	"Mumbai / Bombay SE.Mumbai Sensitive Index"),
			new Array(	"set50",			"instrlist",	"Bangkok.SET 50"),
			new Array(	"sharebearer",		"search",		"cfi=esvufb"),					// search DB with key CFI: share bearer
			new Array(	"smi",			"instrlist",	"Virt-X.Virt-X CHF SMI Constituents"),
			new Array(	"spi",			"instrlist",	"SWX.Swiss Performance Index"),
			new Array(	"spmib",			"instrlist",	"Milano.Titoli S&P/MIB"),
			new Array(	"straits",			"instrlist",	"9CC7D9A16335FAC3FEFDE21553DE6F2C"),	// old short-cut for "Straits Times Index"
			new Array(	"sti",			"instrlist",	"9CC7D9A16335FAC3FEFDE21553DE6F2C"),	// the same as ".STRAITS", request from TK Singapore
			new Array(	"twn",			"instrlist",	"Taiwan SE.TWN Weighted Index"),
			new Array(	"usd",			"instrlist",	"Foreign Exchange.USD Forex"),
			new Array(	"vola",			"instrlist",	"Indices.Volatility Indices"),
			new Array(	"vwd",			"news",		"63510,,"),						// News/Dow Jones News - Finwire News -> Dow Jones News
			new Array(	"?",				"help",		""),							// Overview Short Cuts
			new Array(	"?cont",			"table",		"25"),
			new Array(	"?cy",			"table",		"10"),
			new Array(	"?dom",			"table",		"3991"),
			new Array(	"?evc",			"table",		"64"),
			new Array(	"?it",			"table",		"5"),
			new Array(	"?mc",			"table",		"18"),
			new Array(	"?sec",			"table",		"3"),
			new Array(	"?stt",			"table",		"75"),
			new Array(	"?vs",			"table",		"78"),
			new Array(	"?vt",			"table",		"76"),
			new Array(	"?x",				"table",		"713")						// last array item w/o coma
			];

 	for (var i = 0; i < names.length; i++) {
   		if (name == names[i][0]) {
			type	  = names[i][1];			// switch type is given
			mainpar = names[i][2];			// type main parameter is given
			break;
    		}
  	}
	switch (type) {
		case "help": 					// help: on-line Help with short-cuts overview	
			showHelp("/idhtmlhelp/help/" + lc + "/shortcuts_overview.htm");
			break;
		case "instrlist":					// list ID: code the URL text with 'escape(text)', decode it with 'unescape(text)'
			document.location.href = "/idhtml/listing/display.jsp?search_keyword=" + encodeURIComponent(search_text) + "&list=" + encodeURIComponent(mainpar) + "&owner=TK" + "&search_text="+encodeURIComponent(search_text);
			break;
		case "news":					// news: screen topic code & agency code & language code
			var codes = mainpar.split(",");	// mainpar = "agency,topic,language"
			var news  = "agency=" + codes[0] + "&select=" + codes[1] + "&lc=" + codes[2];
			document.location.href = "/idhtml/news/list.jsp?search_keyword=" + encodeURIComponent(search_text) + "&" + news + "&search_text="+encodeURIComponent(search_text);
			break;
		case "newsviewer":				// news: news viewer -> all news
			document.location.href = "/idhtml/news/list.jsp?search_keyword=" + encodeURIComponent(search_text) + "&search_text="+encodeURIComponent(search_text);
			break;
		case "search":					// search for security code -> search result call
			document.location.href = "/idhtml/search/display.jsp?search_keyword=" + encodeURIComponent(search_text) + "&search=" + encodeURIComponent(mainpar) + "&search_styles_owner=TK&search_style="+ "&search_text="+encodeURIComponent(search_text);
			break;
		case "table":					// table: table ID	
			document.location.href = "/idhtml/system/content_red.jsp?search_keyword=" + encodeURIComponent(search_text) + "&tableId=" + mainpar + "&search_text="+encodeURIComponent(search_text);
			break;
     		default:						// failure: short-cuts help screen !	
			var yes = window.confirm("Short-Cut \"Instruments & News Display\"\n\nWarning:\nYour command \"" + listing + "\" is wrong. Do you want to consult command lists in \"Short-Cuts Help\" ?");
			if (yes) { shortcuts(help, lc,""); }	// get Help from SIX iD HTML on-line manual
	}
	return rvalue;						// function's return value
}

function showVersion()
{
	// command with regular expression: [.](shortcuts version)
	var rvalue = "";													// function's return value (if empty - Ok)
	window.alert("Short-Cuts Version:\t\t      1.0.2\n\nModified on:\t 06.10.2006  10:00");
	return rvalue;													// function's return value
}
