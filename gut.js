// JavaScript for Looking up books
// Jim Skon, Kenyon College, 2024
var searchType;  // Save search type here
const baseUrl = 'https://gutendex.com';
var nextMatches = '';
var prevMatches = '';

console.log("Start!");
var searchLangAbrv="en";
// Add a click event for the search button
document.querySelector("#search-btn").addEventListener("click", (e) => {
    getMatches();
});


// Add an event listener for each item in the pull down menu
document.querySelectorAll('.dropdown-menu a').forEach(item => {
    item.addEventListener('click', event => {
		var element = event.target;
		var searchLang=element.textContent;
		searchLangAbrv = element.getAttribute("value");
		console.log("pick: "+searchLang+" "+searchLangAbrv);
		// Get the pulldown parent
		var pullDown = element.parentElement.parentElement;
		// Get and set the selection displayed
		var selection = pullDown.querySelectorAll(".selection")[0];
		selection.innerHTML = searchLang;
    })
})


function getBook(url) {
	console.log("URL: "+url);
	window.open(url,"_blank");
	return;
}

// Build output table 
function nameTable(data) {
    var table = '<table class="w3-table-all w3-hoverable" border="2"><tr><th>Title</th><th>Author</th><tr>';
    count = data["count"];
    nextMatches = data["next"];
    prevMatches = data["previous"];
    table = "<h3>Matches: "+count+"</h3>" + table;
    if (prevMatches) {
    	table += '<button id="prev-btn" class="btn btn-outline-success my-2 my-sm-0" type="button">Previous</button>';
	}
    results = data["results"];
    
    results.forEach(function (entry,i) {
    	authorsJson = entry["authors"];
    	authors="";
    	authorsJson.forEach(function (a,i) {
    		authors += a["name"] + " ";
    	});
		table += "<tr><td><a onclick='getBook(\""+entry["formats"]["text/html"]+"\")' href='#'>"+entry["title"]+"</a>";
		if (entry["formats"]["text/plain"]) {
			table+="  [<a onclick='getBook(\""+entry["formats"]["text/plain"]+"\")' href='#'>text</a>]";
		}
		table+="</td><td>"+authors+"</td></tr>";
    });
    table += "</table>";
    if (nextMatches) {
    	table += '<button id="next-btn" class="btn btn-outline-success my-2 my-sm-0" type="button">Next</button>';
	}
    return table;
}


function processResults(results) {
    document.querySelector('#searchresults').innerHTML = nameTable(results);
    // Next Button
	if (nextMatches) {
		document.querySelector("#next-btn").addEventListener("click", (e) => {
    		getNextMatches();
		});
	}
	if (prevMatches) {
		document.querySelector("#prev-btn").addEventListener("click", (e) => {
    		getNextMatches();
		});
	}
}

function clearResults() {
    document.querySelector('#searchresults').innerHTML = "";
}

function getMatches(){
    console.log("getMatches!");
    var titleauth=document.querySelector('#titleauth').value;
    var topic=document.querySelector('#topic').value;
    var startyear=document.querySelector('#startyear').value;
    var endyear=document.querySelector('#endyear').value;
    console.log("Search: "+titleauth+":"+topic+":"+startyear+":"+endyear);


    // Clear the previous results
    document.querySelector('#searchresults').innerHTML = "";
    
    // Build search query
	var searchStr = '';
	if (titleauth) {
		searchStr += 'search=' + titleauth;
	}
	if (searchLangAbrv) {
		if (searchStr) searchStr += "&";
		searchStr += 'languages=' + searchLangAbrv;
	}	
	if (topic) {
		if (searchStr) searchStr += "&";
		searchStr += 'topic=' + topic;
	}	
	if (startyear) {
		if (searchStr) searchStr += "&";
		searchStr += 'author_year_start=' + startyear;
	}
	if (endyear) {
		if (searchStr) searchStr += "&";
		searchStr += 'author_year_end=' + endyear;
	}
	
	if (searchStr) {
		searchStr = '/books?mime_type=text%2Fhtml&' + searchStr;
	} else {
		searchStr = '/books?mime_type=text%2Fhtml';
	}
	console.log(searchStr);
	
    fetch(baseUrl+searchStr, {
	method: 'get'
    })
	.then (response => response.json() )
        .then (data => processResults(data))
	.catch(error => {
	    {alert("Error: Something went wrong:"+error);}
	})
}

function getNextMatches() {
    // Clear the previous results
    document.querySelector('#searchresults').innerHTML = "";
	
    fetch(nextMatches, {
	method: 'get'
    })
	.then (response => response.json() )
        .then (data => processResults(data))
	.catch(error => {
	    {alert("Error: Something went wrong:"+error);}
	})
}

