<?php
require('wiqui.php');
function mlog($e)
{
	file_put_contents('log',microtime()."\t".$e."\n",FILE_APPEND);
}
function shelf_mark($str)
{
	$str = strtolower(urlencode($str));
	return $str[0].$str[1];
}
		// CLASS AUTOLOADER //
function chargeClass($class) { require $class . '.php'; }
spl_autoload_register('chargeClass');
/*
$arbre = new Tree();
$arbre->dvlpNode('Moondog');
$arbre->findChild(3);
//file_put_contents("arbre.json",$arbre->export_json());
//$arbre->delNode(3);
file_put_contents("arbre.json",$arbre->export_json());*/
/*foreach($arbre->findLink(3,15) as $e)
{
	print_r($arbre->getNode($arbre->getLink($e)->getSource())->getTitle()."\t\t".$arbre->getNode($arbre->getLink($e)->getTarget())->getTitle()."\n");
}*/
//print_r($arbre);
//unset($arbre);
//$arbre2 = new Tree(); 				//INIT
//$arbre2->dvlpNode("Janis Joplin");
//$arbre2->findChild(25);
/*$ch = "Harry Partch";
$data = classif_article($ch,$arbre2->getLang());
$arbre2->addLog($ch);
$arbre2->addNode($ch);
foreach ($data AS $d)
{
	$arbre2->addNode($d,$ch,1);
}
$ch = "Steve Reich";
$data = classif_article($ch,$arbre2->getLang());
$arbre2->addLog($ch);
$arbre2->addNode($ch);
foreach ($data AS $d)
{
	$arbre2->addNode($d,$ch,1);
}*/
//print_r($arbre2->getNode(2)->getId()."\t".$arbre2->getNode(2)->getTitle()."\t".$arbre2->getNode(2)->getParent()."\n");
//file_put_contents("arbre.json",$arbre2->export_json());
/*$results = json_decode(file_get_contents("arbre.json"),true);
$arbre2 = new Tree();
$arbre2->import_json($results);*/


