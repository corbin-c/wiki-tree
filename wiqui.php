<?php function get_wiki($s)
{
	$ch = curl_init($s);
	curl_setopt($ch, CURLOPT_HTTPGET, TRUE);
	curl_setopt($ch, CURLOPT_POST, FALSE);
	curl_setopt($ch, CURLOPT_HEADER, false);
	curl_setopt($ch, CURLOPT_NOBODY, FALSE);
	curl_setopt($ch, CURLOPT_VERBOSE, FALSE);
	curl_setopt($ch, CURLOPT_REFERER, "");
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);
	curl_setopt($ch, CURLOPT_MAXREDIRS, 4);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
	curl_setopt($ch, CURLOPT_USERAGENT, "Dat-Tree - Experimental viz tool for wikipedia by C.CORBIN https://github.com/corbin-c/dat-tree");
	$str = curl_exec($ch);
	$data = json_decode($str,true);
	return $data;
}
function classif_article($s,$pj) {
	$url = "http://".urlencode($pj).".wikipedia.org/w/api.php?action=query&titles=".urlencode($s)."&prop=categories&format=json&cllimit=500&clshow=!hidden&formatversion=2&utf8=";
	$donnees = get_wiki($url)["query"]["pages"];
	$donnees = end($donnees)["categories"];
	foreach($donnees as $cle => $element)
	{
		$donnees[$cle] = $element["title"];
	}
	return $donnees;
}
function categ_members($s,$pj) {
	$url = "http://".urlencode($pj).".wikipedia.org/w/api.php?action=query&cmtitle=".urlencode($s)."&format=json&cmlimit=500&list=categorymembers&formatversion=2&utf8=";
	$data = get_wiki($url)["query"]["categorymembers"];
	return $data;
}
function get_content($s,$pj) {
	$url = "http://".urlencode($pj).".wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=3&titles=".urlencode($s)."&exintro=true&exlimit=1&format=json&formatversion=2&utf8=";
	$data = end(get_wiki($url)["query"]["pages"])["extract"];
	if ($data == "")
	{
	$url = "http://".urlencode($pj).".wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=3&titles=".urlencode($s)."&exlimit=1&format=json&formatversion=2&utf8=";
	$data = end(get_wiki($url)["query"]["pages"])["extract"];
	}
	return $data;
}
function get_wlinks($s,$pj)
{
	$url = "http://".urlencode($pj).".wikipedia.org/w/api.php?action=query&titles=".urlencode($s)."&prop=links&format=json&pllimit=500&formatversion=2&utf8=";
	$data = end(get_wiki($url)["query"]["pages"])["links"];
	foreach ($data AS $k => $d)
	{
		if ($d["ns"] == 0)
		{
			$data[$k] = $d["title"];
		}
		else
		{
			unset($data[$k]);
		}
	}
	$data = array_values($data);
	return $data;
}
?>
