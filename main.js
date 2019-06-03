document.getElementById("submit").addEventListener("click", function(e){
	console.log(document.getElementById("str_search").value)		
	url = "http://fr.wikipedia.org/w/api.php?action=query&titles="+capital_letter(document.getElementById("str_search").value)+"&prop=categories&format=json&cllimit=500&clshow=!hidden&formatversion=2&redirects&utf8=";
	url = new Url(url,"https://cors-anywhere.herokuapp.com/");
	url.ready(function(e) {
		url = JSON.parse(e.response)
		console.log(url)
	});
})
function capital_letter(str) 
{
	str = str.split(" ");
	for (var i=0,x=str.length;i<x;i++) {str[i]=str[i][0].toUpperCase()+str[i].substr(1);}
	return str.join(" ");
}
