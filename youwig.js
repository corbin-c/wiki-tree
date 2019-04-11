function youwig(quoi) { 
	if (confirm("Rechercher sur Wikipedia ?")){
	  window.open('https://fr.wikipedia.org/w/index.php?search='+quoi);
	}
	if (confirm("Rechercher sur Youtube ?")){
	  window.open('https://www.youtube.com/results?search_query='+quoi);
	}
	if (confirm("Rechercher sur Google ?")){
	  window.open('http://www.google.fr/search?q='+quoi);
	}
}