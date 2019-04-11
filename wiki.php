<?php
ini_set('memory_limit', '1024M'); //maybe this is a little bit excessive
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
function doublons($q,$d) {
	global $artiste;
	$i = 0;
	foreach($artiste["catmere"] as $cle => $element)
	{
		foreach($element["filles"] as $k => $elt)
		{
			if ($q["pageid"]==$elt["pageid"] && $elt["title"] != $artiste["titre"])
			{
				$i++;			

			}
		}
	}
	if ($i > $d)
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
<input type="hidden" id="recherche" name="recherche" value="<?php echo $_POST['recherche']; ?>"/><input type="hidden" id="degre" name="degre" value="<?php echo $degre; ?>" /><input type="hidden" id="catchoix" name="catchoix" value="done" /><input type="hidden" id="projet" name="projet" value="<?php echo $projet; ?>" />
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
		$nbcat = count($artiste["catmere"]);
		foreach($artiste["catmere"] as $cle => $element)
		{
			$artiste["catmere"][$cle]["filles"] = wikiquery2($element["title"],$projet);
		}
		//echo "<pre>";
		//var_export($artiste);
		//echo "</pre>";

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
		    'Artiste',
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
			      'Artiste' => $element["title"]),
			   array('arrowsize' => 0.3,
			   'sametail' => TRUE,
			   'len'  => 3)
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
			   	'len'  => 5)
			   );
			}
			//if ($r+$couleurdiff < 220) {$r = $r+$couleurdiff;}
			//elseif ($v+$couleurdiff < 240) {$v = $v+$couleurdiff;}
			//elseif ($b+$couleurdiff < 255) {$b = $b+$couleurdiff;}

			//echo "rouge:".$r."vert".$v."bleu:".$b."<br/>";

		}
		  
		$code_svg=str_replace('<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">', "",$graph->fetch('svg','neato'));
		echo "<!DOCTYPE html><html><head>
<script type='text/javascript' src='youwig.js'></script>
<meta charset='utf-8' /></head><body><image type='svg'>";
		echo $code_svg;
		echo "</image></body></html>";
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
<label>Similarité :<input type="number" id="degre" name="degre" min="0" max="10" /></label><br/>
<label><input type="checkbox" name="catchoix" id="catchoix"/>Choisir les catégories affichées</label><br/>
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
