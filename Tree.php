<?php
class Tree
{
	const LANG_INIT = 'fr';
	private $nodes;
	private $links;
	private $log;
	private $lang;
	private $ilinks;
	private $lastid;
	private $lastlinkid;
	private $newnodes;
	private $modif;

public function __construct($lg = false) {
	if ($lg != false)
		$this->lang = $lg;
	else
		$this->lang = self::LANG_INIT;
	$this->nodes = array();
	$this->modif = true;
	$this->node_list = array();
	$this->links = array();
	$this->ilinks = array();
	$this->log = array();
	$this->newnodes = array();
}
function session_init($e)
{
	if ($e == 1)
	{
		Node::set_i($this->lastid);
		Link::set_i($this->lastlinkid);
		$this->modif = true;
	}
	else
	{
		$this->lastlinkid = Link::get_current_i();
		$this->lastid = Node::get_current_i();
	}
}
function import_json($json)
{
	$this->log = $json['log'];
	$this->lang = $json['lang'];
	$this->node_list = $json['node_list'];
	foreach($json['nodes'] AS $n)
	{
		$q = new Node($n['title'],$n['parent'],$n['group'],$n['value'],$n['id'],$n['linked']);
		$this->nodes[$n['id']] = $q;
	}
	foreach($json['links'] AS $l)
	{
		$n = new Link($l['source'],$l['target'],$l['strength'],$l['id']);
		$this->links[$l['id']] = $n;
	}
	foreach($json['ilinks'] AS $l)
	{
		$n = new Link($l['source'],$l['target'],$l['strength'],$l['id']);
		$this->ilinks[$l['id']] = $n;
	}
	Node::set_i($json['lastid']);
	Link::set_i($json['lastlinkid']);
}

public function addLog($str)
{
	if (!in_array($str,$this->log))
	{
		$this->log[] = $str;
	}
}
public function addNode($tt,$par = false,$gr = false)
{
	$no_add = $this->findNode($tt);
	if (!$no_add)
	{
		$n = new Node($tt,$par,$gr);
		$this->nodes[$n->getId()] = $n;
		$this->node_list[shelf_mark($tt)][] = $n->getId();
		if ($par != false)
		{
			if (!is_numeric($par))
			{
				$par = $this->findNode($par);
				if (is_numeric($par)) {	$n->setParent($par); }

			}
			$this->addLink($par,$n->getId());
		}
		if (in_array($gr,[0,2]))
		{
			$this->newnodes[] = $n->getId();
		}
		$no_add = $n->getId();
	}
	else
	{
		if ($par != false)
		{
			if (!is_numeric($par))
			{
				$par = $this->findNode($par);
			}
			$this->addLink($par,$no_add);
		}
	}
	if (in_array($this->nodes[$no_add]->getGroup(),[0,2]))
	{
		if (isset($this->ilinks[shelf_mark($tt)]))
		{
			foreach($this->ilinks[shelf_mark($tt)] AS $c => $e)
			{
				if (strtolower($e[1]) == strtolower($tt))
				{
					if (isset($this->nodes[$e[0]]))
					{
						$this->addLink($e[0],$no_add);
					}
					unset($this->ilinks[shelf_mark($tt)][$c]);
				}
			}
		}
	}
}
public function addLink($src,$tgt,$sg=0,$i=0)
{
	if ($i)
	{
		$n = $this->findNode($tgt);
		if ($n !== false)
		{
			$this->addLink($src,$n,$sg);
			$this->modif = true;
		}
		else
		{
			$this->ilinks[shelf_mark($tgt)][] = array($src,$tgt);
		}
	}
	else
	{
		if (is_numeric($src))
		{
			if (!$this->findLink($src,$tgt))
			{
				$l = new Link($src,$tgt,$sg);
				$this->links[$l->getId()] = $l;
				$this->nodes[$src]->incrValeur();
				$this->nodes[$tgt]->incrValeur();
				$this->nodes[$src]->addLinked([1,$tgt,$l->getId()]);
				$this->nodes[$tgt]->addLinked([0,$src,$l->getId()]);
			}
		}
	}
}
// Explorer un node
	//------------------ Elements parents
	public function dvlpNode($ch)
	{
		if (is_numeric($ch))
		{
			$t = $this->nodes[$ch]->getTitle();
			$g = $this->nodes[$ch]->getGroup();
			if ($g == 1) { $g = 3; }
			else if ($g == 2) { $g = 0; }
			$this->nodes[$ch]->setGroup($g);
		}
		else
		{
			$t = $ch;
			$this->addLog($t);
			$this->addNode($t);
		}
		$data = classif_article($t,$this->getLang());
		foreach ($data AS $d)
		{
			$this->addNode($d,$ch,1);
		}
	}
	//------------------ Elements enfants
	public function findChild($ch)
	{
		$real = 0;
		if (is_numeric($ch))
		{
			if (isset($this->nodes[$ch]))
			{
				$t = $this->nodes[$ch]->getTitle();	
				$real = 1;
			}
		}
		else
		{
			if ($this->findNode($ch))
			{
				$t = $ch;
				$real = 1;
			}
		}
		if ($real)
		{
			$data = categ_members($t,$this->getLang());
			foreach ($data AS $d)
			{
				if ($d['ns'] == 0)
				{
					$group = 2;
				}
				else
				{
					$group = 1;
				}
				$this->addNode($d['title'],$ch,$group);
			}
		}
	}
	//------------------ Liens internes
	public function internalLinks($ch)
	{
		if (isset($this->nodes[$ch]))
		{
			$this->modif = false;
			$t = $this->nodes[$ch]->getTitle();
			$data = get_wlinks($t,$this->getLang());
			foreach ($data AS $d)
			{
				$this->addLink($ch,$d,0,1);
			}
		}
	}

public function delNode($id)
{
//	mlog($id);
	if (is_string($id))
	{
		$tt = $id;
		$id = $this->findNode($id);
		//mlog($id);
	}

	if (isset($this->nodes[$id]))
	{
		$tt = $this->nodes[$id]->getTitle();
		foreach ($this->nodes[$id]->getLinked() AS $c => $e)
		{
			unset($this->links[$e[1]]);
			$this->nodes[$c]->delLinked($id);
			if (!$this->nodes[$c]->getLinked())
			{
				$this->delNode($c);
			}
			else
			{
				$this->nodes[$c]->decrValeur();
			}
		}
		unset($this->nodes[$id]);
		unset($e);
		unset($c);
		foreach ($this->node_list[shelf_mark($tt)] as $c => $e)
		{
			if ($e == $id)
			{
				unset($this->node_list[shelf_mark($tt)][$c]);
				if (count($this->node_list[shelf_mark($tt)])==0)
					unset($this->node_list[shelf_mark($tt)]);
			}
		}
	}
}
public function filterTree($lvl)
{
	foreach ($this->nodes AS $c => $e)
	{
		if ($e->getValeur() < $lvl)
		{
			$this->delNode($c);
		}
	}
}

// Accesseurs
public function getLang() { return $this->lang; }
public function getLog() { return $this->log; }
public function getNode($id) { return $this->nodes[$id]; }
public function getNewNodes() { $nn = $this->newnodes; $this->newnodes = array(); return $nn; }
public function getNodeList() { return $this->node_list; }
public function getLink($id) { return $this->links[$id]; }
public function getModif() { return $this->modif; }
public function getILinks() { return $this->ilinks; }

public function findNode($tt)
{
	$return = false;
	//mlog($tt);
	if ($this->node_list[shelf_mark($tt)])
	{
		foreach ($this->node_list[shelf_mark($tt)] AS $n)
		{
			if (strtolower($this->nodes[$n]->getTitle()) == strtolower($tt))
			{
				$return = $n;
				break;
			}
		}
	}
	return $return;
}
public function findLink($src,$tgt,$ilink=false)
{
	$return = false;
		foreach ($this->nodes[$src]->getLinked() as $c => $e)
		{
			if ($c == $tgt)
			{
				$return = $e[1];
				break;
			}
		}
	return $return;
}
public function sonsOf($id)
{
	$r = array();
	if (!is_numeric($id))
	{
		$id = $this->findNode($id);
	}
	if (count($this->nodes[$id]->getLinked()) > 0)
	{
		foreach($this->nodes[$id]->getLinked() as $c => $e)
		{
			if (isset($this->nodes[$c]))
			{
				$r[] = $c;
			}
		}
	}
	return $r;
}
public function export_json()
{
	$json = array('nodes' => [], 'links' => [], 'log' => [], 'lang' => '');
	foreach ($this->nodes AS $e)
	{
		$json['nodes'][] = array('title' => $e->getTitle(), 'id' => $e->getId(), 'parent' => $e->getParent(), 'group' => $e->getGroup(), 'value' => $e->getValeur(), 'linked' => $e->getLinked());

	}
	unset($e);
	foreach ($this->links AS $e)
	{

		$json['links'][] = array('id' => $e->getId(), 'source' => $e->getSource(), 'target' => $e->getTarget(), 'strength' => $e->getStrength());
	}
	unset($e);
	$json['lang'] = $this->lang;
	$json['log'] = $this->log;
	$json = json_encode($json);
	return $json;
}
}
