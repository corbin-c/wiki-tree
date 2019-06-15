cors_oui = true;
adresse = "https://fr.wikipedia.org/w/api.php?action=query&titles=Boris Vian&prop=categories&format=json&cllimit=500&clshow=!hidden&redirects&utf8";
adresse = (cors_oui) ? adresse+"&origin=*":adresse;
url = new Url(adresse,"https://cors-anywhere.herokuapp.com/");
url.ready(function(e) {
	console.log(e)
});	

cors_oui = true;
adresse = "https://fr.wikipedia.org/w/api.php?action=query&titles=Boris Vian&prop=links&format=json&pllimit=500&redirects&utf8";
adresse = (cors_oui) ? adresse+"&origin=*":adresse;
url = new Url(adresse,"https://cors-anywhere.herokuapp.com/");
url.ready(function(e) {
	console.log(e)
});	
