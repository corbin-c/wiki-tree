<?php
ini_set('memory_limit', '1024M');
$max = 0;
function zeropad($num, $lim)
{
	  
	return (strlen($num) >= $lim) ? $num : zeropad("0" . $num,2);
}
function wikiquery($s,$pj) {
	global $n;
	$url = "http://".urlencode($pj).".wikipedia.org/w/api.php?action=query&titles=".urlencode($s)."&prop=categories&format=dbg&cllimit=500&clshow=!hidden";
	$ch = curl_init($url);
	curl_setopt($ch, CURLOPT_HTTPGET, TRUE);
	curl_setopt($ch, CURLOPT_POST, FALSE);
	curl_setopt($ch, CURLOPT_HEADER, false);
	curl_setopt($ch, CURLOPT_NOBODY, FALSE);
	curl_setopt($ch, CURLOPT_VERBOSE, FALSE);
	curl_setopt($ch, CURLOPT_REFERER, "");
	//curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);
	curl_setopt($ch, CURLOPT_MAXREDIRS, 4);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
	curl_setopt($ch, CURLOPT_USERAGENT, "Dat-Tree Project - https://www.github.com/Tougodo/dat-tree");
	$str = curl_exec($ch);
	eval('$data = ' . $str . ';');
	$donnees = $data["query"]["pages"];
	foreach($donnees as $cle => $element)
	{
		$donnees = $donnees[$cle]["categories"];
	}
	return $donnees;
}
function wikiquery2($s,$pj) {
	$url = "http://".urlencode($pj).".wikipedia.org/w/api.php?action=query&cmtitle=".urlencode($s)."&format=dbg&cmlimit=500&list=categorymembers";
	$ch = curl_init($url);
	curl_setopt($ch, CURLOPT_HTTPGET, TRUE);
	curl_setopt($ch, CURLOPT_POST, FALSE);
	curl_setopt($ch, CURLOPT_HEADER, false);
	curl_setopt($ch, CURLOPT_NOBODY, FALSE);
	curl_setopt($ch, CURLOPT_VERBOSE, FALSE);
	curl_setopt($ch, CURLOPT_REFERER, "");
	//curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);
	curl_setopt($ch, CURLOPT_MAXREDIRS, 4);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
	curl_setopt($ch, CURLOPT_USERAGENT, "Dat-Tree Project - https://www.github.com/Tougodo/dat-tree");
	$str = curl_exec($ch);
	eval('$data = ' . $str . ';');
	$data = $data["query"]["categorymembers"];

	return $data;
}
function wikiquery3($s,$pj) {
	$url = "http://".urlencode($pj).".wikipedia.org/w/api.php?action=query&titles=".urlencode($s)."&prop=links&format=dbg&pllimit=500";
	$ch = curl_init($url);
	curl_setopt($ch, CURLOPT_HTTPGET, TRUE);
	curl_setopt($ch, CURLOPT_POST, FALSE);
	curl_setopt($ch, CURLOPT_HEADER, false);
	curl_setopt($ch, CURLOPT_NOBODY, FALSE);
	curl_setopt($ch, CURLOPT_VERBOSE, FALSE);
	curl_setopt($ch, CURLOPT_REFERER, "");
	//curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);
	curl_setopt($ch, CURLOPT_MAXREDIRS, 4);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
	curl_setopt($ch, CURLOPT_USERAGENT, "Dat-Tree Project - https://www.github.com/Tougodo/dat-tree");
	$str = curl_exec($ch);
	eval('$data = ' . $str . ';');
	$donnees = $data["query"]["pages"];
	foreach($donnees as $cle => $element)
	{
		$donnees = $donnees[$cle]["links"];
	}
	return $donnees;
}
function doublons($q,$d) {
	global $artiste;
	global $lienslt;
	global $liens;
	if ($lienslt=="on") { $d=1; }
	$i = 0;
	foreach($artiste["catmere"] as $cle => $element)
	{
		foreach($element["filles"] as $k => $elt)
		{
			if ($q["pageid"]==$elt["pageid"] && $elt["title"] != $artiste["titre"] && $lienslt=="off")
			{
				$i++;			

			}
		}
	}
	if ($liens=="on")
	{
		foreach($artiste["liens"] as $cle => $element)
		{
			if ($q["title"]==$element["title"]) 
				{
					$i++;			
				}
		}
	}
	if ($i >= $d)
	{
		return true;

	}
	else
	{
		return false;
	}
}
function lienmusical($q,$d) {
	global $artiste;
	$i = 0;
	$mytable ="pageslies";
	$titre = SQLite3::escapeString($q["title"]);
	$titre = SQLite3::escapeString($titre);
	$base=new SQLite3("./wiki.db"); 
	$query = "SELECT COUNT(*) FROM ".$mytable." WHERE (title='".$titre."')";
	$results = $base->query($query);
	$results = $results->fetchArray();
	if ($results["COUNT(*)"]!=0) { $i++; }
	foreach($artiste["catmere"] as $cle => $element)
	{
		foreach($element["filles"] as $k => $elt)
		{
			if ($q["title"]==$elt["title"])
			{
				$i++;			
			}
		}
	}
	if ($i >= $d)
	{
		//echo $i." : ".$q["title"]."<br/>";
		return true;
	}
	else
	{
		return false;
	}
}



if (isset($_POST['recherche']))
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
<form action="wiki.php" method="POST">
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
				//echo "<pre>";
		//var_export($artiste);
		//echo "</pre>";
		require_once 'Image/GraphViz.php';
			$gatts=array( //defaults for graph level attributes
			    'size'=>20,
			    'font'=>"Sans-serif",
			);
		  $graph = new Image_GraphViz(true,$gatts);

		  $graph->addNode(
		    $artiste["titre"],
		    array(
		      'URL'   => "javascript:youwig('".urlencode($artiste['titre'])."')",
		      'label' => $artiste["titre"],
		      //'shape' => 'box',
		      'color' => 'red',
			'fixedsize'  => FALSE,
			'style' => 'filled',
			'fillcolor' => '#FF0000',
			'fontsize'  => 20,
			'margin'  => "0.1, 0.1",
			'splines'  => TRUE,
			'overlap'  => FALSE
		    )
		  );
		
		foreach($artiste["catmere"] as $cle => $element)
			{
			$r=rand(0,255);
			$b=rand(0,255);
			$v=rand(0,255);
			  $graph->addNode(
			    $element["title"],
			    array(
			      //'URL'      => 'http://link2',
				'shape' => 'box',
				'style' => 'filled',
				'fillcolor' => "#".zeropad(dechex($r),2).zeropad(dechex($v),2).zeropad(dechex($b),2),
				'fixedsize'  => FALSE,
				'fontsize'  => 16,
				'margin'  => "0.01, 0.01",
				'splines'  => TRUE,
				'overlap'  => FALSE,
			    )
			  );
			$graph->addEdge(
			    array(
			      $artiste["titre"] => $element["title"]),
			   array('arrowsize' => 0.3,
			   'sametail' => TRUE,
			   'len'  => 5)
			   
			   );
		foreach($element["filles"] as $k => $elt)
			{
		$graph->addNode(
			    $elt["title"],
			    array(
			      'URL'      => "javascript:youwig('".urlencode($elt["title"])."')",
				'fixedsize'  => FALSE,
				'fontsize'  => 14,
				'margin'  => "0.01, 0.01",
				'splines'  => TRUE,
				'overlap'  => FALSE,
			    )
			  );
			$graph->addEdge(
			    array(
			      $elt["title"] => $element["title"]),
			    array('arrowsize' => 0.3,
			   	'sametail' => FALSE,
				'color' => "#".zeropad(dechex($r),2).zeropad(dechex($v),2).zeropad(dechex($b),2),
			   	'len'  => 7,
				)
			   );
			}
			//if ($r+$couleurdiff < 220) {$r = $r+$couleurdiff;}
			//elseif ($v+$couleurdiff < 240) {$v = $v+$couleurdiff;}
			//elseif ($b+$couleurdiff < 255) {$b = $b+$couleurdiff;}

			//echo "rouge:".$r."vert".$v."bleu:".$b."<br/>";
		}
		if ($liens == "on")
		{
			foreach($artiste["liens"] as $cle => $element)
			{
			    $graph->addNode(
			    $element["title"],
			    array(
			      'URL'      => "javascript:youwig('".urlencode($element["title"])."')",
				'style' => 'filled',
				'fillcolor' => "#DCFCCC",
				'fixedsize'  => FALSE,
				'fontsize'  => 14,
				'margin'  => "0.01, 0.01",
				'splines'  => TRUE,
				'overlap'  => TRUE,
			    )
			  );
			$graph->addEdge(
			    array(
			      $artiste["titre"] => $element["title"]),
			   array('arrowsize' => 0.3,
			   'sametail' => TRUE,
			   'len'  => 3,
				'id' => "fille")
			   );
			}
		}  
		$code_svg=str_replace('<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">', "",$graph->fetch('svg','neato'));
		echo "<!DOCTYPE html><html><head>
<script type='text/javascript' src='youwig.js'></script><style>
.edge:hover path, .edge:hover polygon {
stroke-width: 2.5px;
}
.node:hover + .edge, .node:hover + .edge + .edge, .node:hover + .edge + .edge + .edge, .node:hover + .edge + .edge + .edge + .edge, .node:hover + .edge + .edge + .edge + .edge + .edge, .node:hover + .edge + .edge + .edge + .edge + .edge + .edge, .node:hover + .edge + .edge + .edge + .edge + .edge + .edge + .edge, .node:hover + .edge + .edge + .edge + .edge + .edge + .edge + .edge + .edge, .node:hover + .edge + .edge + .edge + .edge + .edge + .edge + .edge + .edge + .edge, .node:hover + .edge + .edge + .edge + .edge + .edge + .edge + .edge + .edge + .edge + .edge
{
stroke-width: 2.5px;
}
.node:hover ellipse
{
stroke-width: 2.5px;
}
</style>
<meta charset='utf-8' /></head><body>";
		echo $code_svg;
		echo "</body></html>";
		//echo json_encode($artiste);
	
	}
}
else
{?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
</head>
<body>
<form action="wiki.php" method="POST">
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
