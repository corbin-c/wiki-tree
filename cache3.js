const svgNS = 'http://www.w3.org/2000/svg';
function cache(evt) {
	var x = evt.target;
	if (x == "[object SVGTextElement]") {
		if (x.parentNode.childNodes.item(1) == "[object SVGPolygonElement]") {
			x = x.parentNode.childNodes.item(1)
		}
		else if (x.parentNode.childNodes.item(1) == "[object SVGEllipseElement]") {
			x = x.parentNode.childNodes.item(1)
		}
	}
	if (x == "[object SVGPolygonElement]") { //Polygones -> Catégories
		var couleur = x.getAttributeNS(null, 'fill')
		if (couleur != "#ffffff" && couleur != "#2e3436") {
			var importants = document.querySelectorAll('.edge');
				for (var i = 0; i < importants.length; i++) {
					if (importants[i].getElementsByTagNameNS(svgNS, 'path').item(0).getAttributeNS(null, 'stroke') != couleur){
							importants[i].style.opacity = '0';
							importants[i].style.strokeWidth = '1';
						}
					else {
							importants[i].style.opacity = '1';
							importants[i].style.strokeWidth = '2.5';
					}
				}
		}
	}
	if (x == "[object SVGEllipseElement]") { //Ellipes -> Artistes
	var titre = x.parentNode.parentNode.parentNode.firstChild.textContent
		var importants = document.querySelectorAll('.edge');
		for (var i = 0; i < importants.length; i++) {
			if (importants[i].getElementsByTagNameNS(svgNS, 'title').item(0).textContent.indexOf(titre) == -1){
							importants[i].style.opacity = '0'
							importants[i].style.strokeWidth = '1';
				}
			else { importants[i].style.opacity = '1'
				importants[i].style.strokeWidth = '2.5'; }
		}

	}
}
function montre(evt) {
	var x = evt.target;
	if (x == "[object SVGTextElement]") {
		if (x.parentNode.childNodes.item(2) == "[object SVGPolygonElement]") {
			x = x.parentNode.childNodes.item(2)
		}
		else if (x.parentNode.childNodes.item(1) == "[object SVGEllipseElement]") {
			x = x.parentNode.childNodes.item(1)
		}
	}
	if (x == "[object SVGPolygonElement]") {
		var couleur = x.getAttributeNS(null, 'fill')
		if (couleur != "#ffffff" && couleur != "#2e3436") {
			var importants = document.querySelectorAll('.edge');
				for (var i = 0; i < importants.length; i++) {
					importants[i].style.opacity = '1'
					importants[i].style.strokeWidth = '1';

				}
		}
	}
	if (x == "[object SVGEllipseElement]") { //Ellipes -> Artistes
	var titre = x.parentNode.parentNode.parentNode.firstChild.textContent
		var importants = document.querySelectorAll('.edge');
		for (var i = 0; i < importants.length; i++) {
			importants[i].style.opacity = '1'
			importants[i].style.strokeWidth = '1';

		}
	}
}
function charge()
{

	var importants = document.getElementsByTagNameNS(svgNS, 'text');
	for (var i = 0; i < importants.length; i++) {
		if (importants.item(i).parentNode.childNodes.item(1) == "[object SVGEllipseElement]") {
			if (importants.item(i).parentNode.childNodes.item(1).getAttributeNS(null, 'fill') != "#c62f21")
			{
				var y = parseFloat(importants.item(i).getAttributeNS(null, 'y'));

				y=y+30;

				y=y.toString();

				importants.item(i).setAttributeNS(null, 'y', y);
			}
		}

	}
}
document.documentElement.addEventListener("mouseover",cache,false);
document.documentElement.addEventListener("mouseout",montre,false);