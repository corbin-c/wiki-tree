<?php
session_start();
require('classes.php');
if (isset($_POST))
{
 /* CAUTION TEST CODE ------- USER is TRUSTED ----------- REQUESTS ARE SUPPOSED TO HAVE ANSWERS */
	$details = 0;
	$mk_for_q = false;
	$q = array();
	$tree = 1;
	$changes = 1;
	if ($_POST['new']==1)
	{
		$arbre = new Tree($_POST['lang']);
		$exec = new ExecPile();
	}
	else
	{
		if (isset($_SESSION['arbre']))
		{
			$arbre = unserialize($_SESSION['arbre']);
		}
		else
		{
			$arbre = new Tree($_POST['lang']);
		}
		if (isset($_SESSION['exec']))
		{
			$exec = unserialize($_SESSION['exec']);
		}
		else
		{
			$exec = new ExecPile();
		}
		$arbre->session_init(1);
		$old = 1;
	}
//	mlog($arbre->getLang());
	if (isset($_POST['lang']))
	{
		if ($_POST['lang'] != $arbre->getLang())
		{
			$req = $arbre->getLog()[0];
			if (!is_string($req))
				$req = $_POST['rq'];
			$req = '$arbre->dvlpNode("'.$req.'");';
			$arbre = new Tree($_POST['lang']);
			$exec = new ExecPile();
		}
	}
	if ($_POST['type'] == 'newnode')
	{
		$req = '$arbre->dvlpNode("'.$_POST['rq'].'");';
	}
	elseif ($_POST['type'] == 'sons')
	{
		$req = '$arbre->findChild("'.$_POST['rq'].'");';
	}
	elseif ($_POST['type'] == 'delthis')
	{
		$req = '$arbre->delNode("'.$_POST['rq'].'");';
	}
	elseif ($_POST['type'] == 'qing')
	{
		$req = '_Q_';
	}
	elseif (isset($_POST['qt']))
	{
		$req = '$arbre->filterTree('.$_POST['qt'].');';
	}
	if (isset($req))
	{
		if ($req != '_Q_')
		{
			$exec->add_req($req);
		}
		$i = 0;

		if (!$exec->is_active())
		{
			$exec->toggle_active();
			while ($i < $exec->count_req())
			{
				$tree=2;
				$r = $exec->last_req();
				eval($r);
				//mlog($arbre->getModif());
				//mlog($r);
				if ($arbre->getModif())
				{
					$tree=1;
				}
				$i++;
			}
			$exec->toggle_active();
			foreach ($arbre->getNewNodes() AS $e)
			{
				$q[] = '$arbre->internalLinks('.$e.');';	
			}
		}

	}
	if ((isset($_POST['oai'])) && (isset($_POST['rq'])))
	{
		foreach ($arbre->sonsOf($_POST['rq']) AS $e)
		{
			$q[] = '$arbre->dvlpNode("'.$e.'");';
		}
	}
	if ((isset($_POST['obi'])) && (isset($_POST['rq'])))
	{
		foreach ($arbre->sonsOf($_POST['rq']) AS $e)
		{
			$q[] = '$arbre->findChild("'.$e.'");';
		}
	}

	if (($exec->count_q() > 0) || (count($q) > 0))
	{
		if (count($q) > 0) //file d'attente
		{
			$exec->add_q($q);
		}
		$exec->q2x();
		$mk_for_q = true;
	}

	if (isset($_POST['details']))
	{
		$arbre = get_content($_POST['details'],$arbre->getLang());
		$tree = 0;
	}
	if ($tree > 0)
	{
		$arbre->session_init(0);
		$_SESSION['arbre'] = serialize($arbre);
		if ($tree == 1)
		{
			$arbre = $arbre->export_json();
		}
		else
		{
			$arbre = "";
		}
	}
	//$json = json_encode(array("req_list" => $exec->get_list(),"q" => $exec->get_q()));
	//file_put_contents("exec.json",$json);
	$_SESSION['exec'] = serialize($exec);
	
	print_r(json_encode(array($tree,$arbre,$mk_for_q)));

}
?>