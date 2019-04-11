<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
</head>
<body>
<?php
if (isset($_GET["q"]))
{
$s = $_GET["q"];
$pj = $_GET["pj"];
// load wikitext converter
//require_once 'Text/Wiki.php';
require_once 'Text/Wiki/Mediawiki.php';

// instantiate a Text_Wiki object from the given class
// and set it to use the Mediawiki adapter
$wiki = & Text_Wiki::factory('Mediawiki');

// set some rendering rules  
$wiki->setRenderConf('xhtml', 'wikilink', 'view_url', "http://".urlencode($pj).".wikipedia.org/wiki/");
$wiki->setRenderConf('xhtml', 'wikilink', 'pages', false);
$wiki->setFormatConf('Xhtml', 'charset', 'UTF-8');
$wiki->setParseConf('wikilink', 'ext_chars', 'false');
	
 
	$url = "http://".urlencode($pj).".wikipedia.org/w/api.php?action=query&titles=".urlencode($s)."&prop=revisions&rvprop=content&format=dbg";
	//echo $url;
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
	$donnees = $data["query"]["pages"];
	
	foreach($donnees as $cle => $element)
	{
		$donnees = $donnees[$cle];
		/*foreach($donnees["categories"] as $c => $e)
		{
			$q = $e["title"];
			$donnees["categories"][$c] = $q;
		}*/
	}
	$donnees = $donnees["revisions"][0]["*"];


$donnees = $wiki->transform($donnees, 'xhtml');
$donnees = explode("<p>",$donnees);
//echo $donnees;
echo $donnees[2]; //fr
//echo $donnees[3]; //en
}
?>
</body>
</html>