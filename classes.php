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
function chargeClass($class) { require $class . '.php'; }
spl_autoload_register('chargeClass');
