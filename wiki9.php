<?php
ini_set('memory_limit', '1024M');
$max = 0;
include("queries.php");
function zeropad($num, $lim)
{
	  
	return (strlen($num) >= $lim) ? $num : zeropad("0" . $num,2);
}
if (isset($_GET['cat']))
{
	$cat_del = $_GET['cat'];
	$liens = $_GET['liens'];
	$len = $_GET['len'];
	$degre = $_GET['deg'];
	$projet = $_GET['projet'];
	$lienslt = "off";
	goto b;
}
elseif (isset($_POST['len'])) {
	$len = $_POST['len'];
	$liens = $_POST['liens'];
	$lienslt = $_POST['lienslt'];
	$projet = $_POST['projet'];
	$degre = $_POST['degre'];
	goto b;
}
elseif(isset($_GET['q']))
{
	$liens = $_GET['liens'];
	$degre = $_GET['degre'];
	$projet = $_GET['projet'];
	$lienslt = $_GET['lienslt'];
	$artiste["titre"] = $_GET['q'];
	$artiste["catmere"] = wikiquery($artiste["titre"],$projet);
	goto a;
}
elseif (isset($_POST['recherche']))
{

	$artiste["titre"] = $_POST['recherche'];
	$projet = $_POST['projet'];
	if (!(is_numeric($_POST['degre']))) { $degre = 0; } else { $degre = $_POST['degre']; }
	$artiste["catmere"] = wikiquery($artiste["titre"],$projet);

	if (isset($_POST['liens']) && $_POST['liens'] == "on") { $liens = "on"; } else { $liens = "off"; }
	if (isset($_POST['lienslt']) && $_POST['lienslt'] == "on") { $lienslt = "on"; } else	{ $lienslt = "off"; }

	if (isset($_POST['catchoix'])&&$_POST['catchoix']=="on")
	{
		?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
</head>
<body>
<form action="wiki9.php" method="POST">
<input type="hidden" id="recherche" name="recherche" value="<?php echo $_POST['recherche']; ?>"/><input type="hidden" id="degre" name="degre" value="<?php echo $degre; ?>" /><input type="hidden" id="catchoix" name="catchoix" value="done" /><input type="hidden" id="projet" name="projet" value="<?php echo $projet; ?>" /><input type="hidden" id="catchoix" name="catchoix" value="done" /><input type="hidden" id="liens" name="liens" value="<?php echo $liens; ?>" /><input type="hidden" id="lienslt" name="lienslt" value="<?php echo $lienslt; ?>" />
Choisir les catégories affichées :<br/>
<?php foreach($artiste["catmere"] as $cle => $element)
	{
?>
<label><input type="checkbox" name="<?php echo $cle;?>" id="<?php echo $cle;?>"/><?php echo $element["title"];?></label><br/>
<?php }
?>
<input type="submit" />
</form>
</body>
</html>
<?php
	}
	elseif ($_POST['catchoix']=="done")
	{
		foreach($artiste["catmere"] as $cle => $element)
		{
			if (!(isset($_POST[$cle])))
			{
				unset($artiste["catmere"][$cle]);
			}
		}
		goto a;
	}
	else
	{
		a:
		foreach($artiste["catmere"] as $cle => $element)
		{
			$artiste["catmere"][$cle]["filles"] = wikiquery2($element["title"],$projet);
		}
		//echo "<pre>";
		//var_export($artiste);
		//echo "</pre>";


/*ANALYSE LIENS EXTERNE */
		if ($liens == "on")
		{
			$artiste["liens"]=wikiquery3($artiste["titre"],$projet);
			foreach($artiste["liens"] as $cle => $element)
			{
				if (!lienmusical($element,$degre))
				{
					unset($artiste["liens"][$cle]);
				}

			}
			//var_export($artiste["liens"]);
		}
		foreach($artiste["catmere"] as $cle => $element)
		{
			foreach($element["filles"] as $k => $elt)
			{
				if (!doublons($elt,$degre))
				{
					unset($artiste["catmere"][$cle]["filles"][$k]);
				}
			}
		}
		if (isset($_GET["q"]))
		{
			$artiste_fils = $artiste;
			$artiste = json_decode(file_get_contents("cache.json"),true);
			foreach($artiste["catmere"] as $cle => $element)
			{
				foreach($element["filles"] as $k => $elt)
				{
					if ($artiste_fils["titre"] == $elt["title"])
					{
						$artiste["catmere"][$cle]["filles"][$k]["fils"] = $artiste_fils;
					}
				}
			}
			foreach($artiste["liens"] as $cle => $element)
			{
				if ($artiste_fils["titre"] == $element["title"])
				{
					$artiste["liens"][$cle]["fils"] = $artiste_fils;
				}
			}
			file_put_contents("cache.json", json_encode($artiste));
			//echo "<pre>";
			//var_export($artiste);
			//echo "</pre>";
		}
		else
		{
		file_put_contents("cache.json", json_encode($artiste));
		}		//echo "<pre>";
		//var_export($artiste);
		//echo "</pre>";
		b:
		if (isset($len))
		{
			$artiste = json_decode(file_get_contents("cache.json"),true);
			if (isset($cat_del))
			{
				unset($artiste["catmere"][$cat_del]);
			}
			foreach($artiste["catmere"] as $cle => $element)
			{
				foreach($element["filles"] as $k => $elt)
				{
					if (!doublons($elt,$degre))
					{
						unset($artiste["catmere"][$cle]["filles"][$k]);
					}
				}
			}
			file_put_contents("cache.json", json_encode($artiste));
		}
		else
		{
			$len = 3;
		}
		require_once 'Image/GraphViz.php';
		include("graph.php");
			$gatts=array( //defaults for graph level attributes
				'size'=>20,
				'bgcolor'=>"#f0ede6", 
				'font'=>"sans-serif",
			);
		  $graph = new Image_GraphViz(true,$gatts);
		graph($artiste,$graph,$len,$liens,$degre,$projet);
		$code_svg=str_replace('<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">', "",$graph->fetch('svg','neato'));
		$code_svg=str_replace('font-family="sans-serif" font-size="16.00"',"",$code_svg);
		$code_svg=str_replace('<title>G</title>',"<title>G</title><foreignObject x='15' y='-45' width='150' height='50'>
        <ul id='menu'>
	<li><a href='#' title='Rechercher sur Wikipédia'><img src='wicon2.png' alt='Wikipedia logo'/></a></li>
	<li><a href='#' title='Rechercher sur Youtube'><img src='yicon2.png' alt='Youtube logo'/></a></li>
	<li><a href='#' title='Rechercher sur Google'><img src='gicon2.png' alt='Google logo'/></a></li>
	<li><a href='wiki9.php?projet=".$projet."&liens=".$liens."&lienslt=".$lienslt."&degre=".$degre."&q=' title='Relancer la recherche de ce point'><img src='sicon.png' alt='Search logo'/></a></li>
	</ul>
</foreignObject>",$code_svg);
		//$code_svg=str_replace('<svg width="1440pt" height="1389pt"','<svg width="100%" height="100%"',$code_svg);
		echo "<!DOCTYPE html><html><head>
<meta charset='utf-8' />
<script type='text/javascript' src='cache3.js'></script>
<script type='text/javascript' src='youwig2.js'></script><style>
html, body
{
	background-color: #f0ede6;
	padding: none;
}
.edge:hover path, .edge:hover polygon {
stroke-width: 2.5px;
}
.node:hover + .edge, .node:hover + .edge + .edge, .node:hover + .edge + .edge + .edge, .node:hover + .edge + .edge + .edge + .edge, .node:hover + .edge + .edge + .edge + .edge + .edge, .node:hover + .edge + .edge + .edge + .edge + .edge + .edge, .node:hover + .edge + .edge + .edge + .edge + .edge + .edge + .edge, .node:hover + .edge + .edge + .edge + .edge + .edge + .edge + .edge + .edge, .node:hover + .edge + .edge + .edge + .edge + .edge + .edge + .edge + .edge + .edge, .node:hover + .edge + .edge + .edge + .edge + .edge + .edge + .edge + .edge + .edge + .edge
{
stroke-width: 2.5px;
}
.node:hover ellipse, .node:hover text, .node:hover polygon
{
stroke-width: 2.5px;
font-weight: bold;
}
.edge
{
   transition-duration: 0.35s;
   transition-timing-function: ease-in;
   transition-delay: 0s;
}
polygon + text {
	font-family: Times;
}
ellipse + text {
	font-family: Arial;
}
#menuflottant
{
	position: fixed;
	background-color: #DDDDDD;
}
#menu
{
	visibility:hidden;
	border: 1px solid grey;
	margin: 0;
	padding: 0;
}
#menu li
{
	display: inline;
	margin: 0;
	padding: 0;
}
</style></head><body>";
?>
<form id="menuflottant" action="wiki9.php" method="POST">
<label for="len"></label><input type="range" value="<?php echo $len;?>" max="9" min="3" step="1" id="len" name="len"/><br/>
<input type="hidden" value="<?php echo $liens; ?>" name="liens" />
<input type="hidden" value="<?php echo $projet; ?>" name="projet" />
<input type="hidden" value="<?php echo "wiki9.php?projet=".$projet."&liens=".$liens."&lienslt=".$lienslt."&degre=".$degre."&q="; ?>" id="urlquery"/>
<input type="hidden" id="lienslt" name="lienslt" value="<?php echo $lienslt; ?>" />
<input type="range" id="degre" name="degre"  max="9" min="1" step="1" value="<?php echo $degre; ?>" /><br/>
<input type="submit" />
</form>

<?php
		echo $code_svg;
		echo "<!-- Original idea, algorithm and coding by Clément Corbin Tramu\n";
		echo "Readibility improvements idea with opacity transitions by Edgar Rock\n";
		echo "Data from Wikipedia -->\n";
		echo "</body></html>";
		//echo json_encode($artiste);
	
	}
}
else
{
?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
</head>
<body>
<form action="wiki9.php" method="POST">
<label>Recherche :<input type="text" id="recherche" name="recherche" /></label><br/>
<label>Similarité :<input type="number" id="degre" name="degre" min="1" max="10" /></label><br/>
<label><input type="checkbox" name="catchoix" id="catchoix"/>Choisir les catégories affichées</label><br/>
<label><input type="checkbox" name="liens" id="liens"/>Suivre les liens internes</label><br/>
<label><input type="checkbox" name="lienslt" id="lienslt"/>UNIQUEMENT les liens internes</label><br/>
<label>Langue<select id="projet" name="projet">
    <option value="fr">Français</option>
    <option value="en">Anglais</option>
    <option value="es">Espagnol</option>
    <option value="pt">Portugais</option>
</select>

<input type="submit" />
</form>
</body>
</html>

<?php
}
?>