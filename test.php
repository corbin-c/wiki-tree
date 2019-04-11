<?php
ini_set('memory_limit', '1024M');
$max = 0;
include("queries.php");
function dvlp($tableau,$lg)
{
	if (isset($tableau["categories"]))
	{
		$tableau["categories"] = dvlp($tableau["categories"],$lg);
	}
	else
	{
		foreach($tableau as $k => $e)
		{
			if ($tableau[$k]["ns"] == 14)
			{
				$tableau[$k]["children"] = wikiquery2($e["title"],$lg);
				//$tableau[$k]["children"] = dvlp($tableau[$k]["children"],$lg);
			}
		}
	}
	return $tableau;
}
echo "<pre>";
$q = "Peter Saville (graphic designer)";
$proj = "en";
$arbre = wikiquery($q,$proj);
$arbre = get_id($arbre,$proj);
$arbre = dvlp($arbre,$proj);
file_put_contents("cache.json", json_encode($arbre));
//$arbre["categories"][0]["children"][14]["children"][2] = wikiquery($arbre["categories"][0]["children"][14]["children"][2]["title"],$proj);
//$arbre["categories"][0]["children"][14]["children"][2] = dvlp($arbre["categories"][0]["children"][14]["children"][2],$proj);
var_export($arbre);
echo "</pre>";
?>