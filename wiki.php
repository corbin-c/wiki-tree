<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
</head>
<body>
<?php
ini_set('memory_limit', '1024M');
$n = 0;
function wikiquery($s,$c,$d) {
	global $n;
	if ($c == NULL)
	{
		$url = "http://fr.wikipedia.org/w/api.php?action=query&cmtitle=".urlencode($s)."&format=dbg&cmlimit=500&list=categorymembers&continue=";
	}
	else
	{
		$url = "http://fr.wikipedia.org/w/api.php?action=query&cmtitle=".urlencode($s)."&format=dbg&cmlimit=500&list=categorymembers&continue=-||&cmcontinue=".urlencode($c);
	}
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
	$donnees = $data["query"]["categorymembers"];
	if ($d == NULL)
	{
		$d = $donnees; //l'array des résultats
	}
	else
	{
		$d = array_merge($d,$donnees);
	}
	if (isset($data["continue"]["cmcontinue"]) && $n <= 100)
	{
		$continue = $data["continue"]["cmcontinue"];
		if ($n == 100)
		{
			echo "<strong style='color: red;'>";
			echo $continue;
			echo "</strong><br/>";
		}
		$n++;
		$d = wikiquery("Catégorie:Portail:Musique/Articles_liés",$continue,$d);
	}
	return $d;
}
echo "<pre>";
var_export(wikiquery("Catégorie:Portail:Musique/Articles_liés","page|3d27334357270704273d2f5527412d492f0342273d2f5527412d492f043d27334357270126018f7f8f7d8f7d8f0900|46661",NULL));
//echo count($truc);
echo "</pre>";
?>
</body>
</html>
