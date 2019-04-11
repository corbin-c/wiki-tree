<?php
function get_id($pages,$pj)
{
	$liste = "";
	foreach($pages["categories"] as $k => $e)
	{
		$liste = $liste.urlencode($e["title"])."|";
	}
	$liste = substr($liste,0,-1);
	$url = "http://".urlencode($pj).".wikipedia.org/w/api.php?action=query&titles=".$liste."&format=dbg";
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
	foreach($donnees as $cle => $elt)
	{
		if (isset($elt["pageid"]))
		{

			$id = $elt["pageid"];
		}
		else
		{
			$id = null;
		}
		
		foreach($pages["categories"] as $k => $e)
		{
			if ($e["title"]==$elt["title"])
			{
				$pages["categories"][$k]["pageid"] = $id;
			}
		}
	}
	return $pages;
}
function wikiquery($s,$pj) {
	global $n;
	$url = "http://".urlencode($pj).".wikipedia.org/w/api.php?action=query&titles=".urlencode($s)."&prop=categories&format=dbg&cllimit=500&clshow=!hidden";
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
	/*unset($donnees["pageid"]);
	unset($donnees["ns"]);*/
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
	curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows; U; Windows NT 6.1; he; rv:1.9.2.8) Gecko/20100722 Firefox/3.6.8");
	$str = curl_exec($ch);
	eval('$data = ' . $str . ';');
	$data = $data["query"]["categorymembers"];
	/*foreach($data as $k => $e)
	{
		$data[$k] = $data[$k]["title"];
	}*/
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
	curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows; U; Windows NT 6.1; he; rv:1.9.2.8) Gecko/20100722 Firefox/3.6.8");
	$str = curl_exec($ch);
	eval('$data = ' . $str . ';');
	$donnees = $data["query"]["pages"];
	foreach($donnees as $cle => $element)
	{
		$donnees = $donnees[$cle]["links"];
	}
	return $donnees;
}
function doublons($q,$d,$tableau) {
	//if ($lienslt=="on") { $d=1; }
	$i = 0;
	foreach($tableau["categories"] as $cle => $element)
	{
		foreach($element["children"] as $k => $elt)
		{
			if ($q["pageid"]==$elt["pageid"] && $elt["title"] != $tableau["title"])
			{
				$i++;			

			}
		}
	}
	/*if ($liens=="on")
	{
		foreach($artiste["liens"] as $cle => $element)
		{
			if ($q["title"]==$element["title"]) 
				{
					$i++;			
				}
		}
	}*/
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
	$base=new SQLite3("/home/clement/Documents/Programmation/wiki/wiki.db"); 
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
?>