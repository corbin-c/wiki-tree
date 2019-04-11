<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
</head>
<body>
<?php

$n=0;
function wikiquery($s) {
	global $n;
	$url = "http://fr.wikipedia.org/w/api.php?action=query&cmtitle=".urlencode($s)."&format=dbg&cmlimit=500&list=categorymembers";
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
	curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows; U; Windows NT 6.1; he; rv:1.9.2.8) Gecko/20100722 Firefox/3.6.8");
	$str = curl_exec($ch);
	eval('$data = ' . $str . ';');
	$data = $data["query"]["categorymembers"];
	foreach($data as $cle => $element)
	{	
		if ($element["ns"]==14 && $n <= 10)
		{
			$data[$cle]["catfille"]=wikiquery($element["title"]);
			echo $element["title"];
			echo "<br/>";
		}
		if ($cle+1==count($data)) //on est au bout d'une branche
		{
			$n=$n+1;
			echo $n;
			echo "<br/>";
		}
	}
	return $data;
}
echo "<pre>";
var_export(wikiquery("Catégorie:Musique"));
echo "</pre>";
?>
</body>
</html>