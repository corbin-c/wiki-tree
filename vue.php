<!DOCTYPE html>

<html xmlns:og="http://ogp.me/ns#">

	<head>
		<meta charset="utf-8" />
		<title> DAT' TREE ! </title>
	<link rel="stylesheet" href="style.css" />
	<script src="d3.v4.min.js"></script>
	</head>
	<body>
<aside id="men3">
<h3>Dat' Tree</h3>
<form id="mainform">
<input type="text" id="requete" value="" onkeypress="test(event)"/><!--<input type="submit" value="Vazi !" />--><br/>
<input type="number" id="qt" value="1" onchange="qunatize()"/><br/>
<?php include('lang.php'); ?>
</form><form>
<fieldset><legend>Légende</legend>
<label><input type="checkbox" id="lgd1" name="lgd1" onchange="show(this.checked,0,2)"/><span class="checkmark"></span>Articles</label>
<label><input type="checkbox" id="lgd2" name="lgd2" onchange="show(this.checked,1,3)"/><span class="checkmark"></span>Cat&eacute;gories</label>
</fieldset>
</form>
<section id="details"></section>
<ul id="compl_search"></ul>
</aside>
<a id="mainbutton" href="#" title="Toggle menu" onclick="togglemenu(this.href)">&equiv;</a>
<svg width="14" height="9">
	<defs>
		<pattern id="pattern3" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" >
			<rect width="20" height="20" x="0" y="0" fill="#fbfbf7" style="opacity:0.3;" stroke="none"/>
			<line x1="0" y1="0" x2="20" y2="0" stroke="#e7b576" stroke-linecap="square" style="opacity:0.5;" stroke-width="1" stroke-dasharray="3" />
			<line x1="0" y1="0" x2="0" y2="20" stroke="#e7b576" stroke-linecap="square" style="opacity:0.5;" stroke-width="1" stroke-dasharray="3" />
		</pattern>
	</defs>
	<rect width="100%" height="100%" x="0" y="0" fill="none"  style="stroke: none; fill: url(#pattern3);" />
</svg>
<script src="mything.js"></script>
<script src="draw.js"></script>
	</body>
</html>