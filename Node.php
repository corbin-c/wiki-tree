<?php
class Node
{
	const GROUP_INIT = 0;
	private static $_i = 0;
	private $id;
	private $title;
	private $group;
	private $parent;
	private $valeur;
	private $linked;
//C
	// Le node est créé à partir d'un title, un groupe et un parent	
public function __construct($tt,$par,$gr = false,$val=0,$id=0,$lk=array()) {
	self::$_i++;
	$this->id = Node::get_current_i();
	$this->title = $tt;
	if ($gr != false) {
		if ((is_numeric($gr)) && ($gr >= 0)) 
		{
			$this->group = $gr;
		}
		else { 	$this->group = self::GROUP_INIT; }
	}
	else {
		$this->group = self::GROUP_INIT;
	}
	$this->parent = $par;
	$this->valeur = $val;
	$this->linked = $lk;
	if ($id !=0) { $this->id = $id; }

}

//M
	public function incrValeur() { $this->valeur++; }
	public function decrValeur() { $this->valeur--; }
	public function setParent($p) { $this->parent = $p; }
	public function setGroup($g) { $this->group = $g; }
	public function addLinked($g) { $this->linked[$g[1]] = array($g[0],$g[2]); }
	public function delLinked($g) { unset($this->linked[$g]); }
	public static function set_i($g) { self::$_i = $g; }
//A
	public static function get_current_i() { return self::$_i; }

	public function getId() { return $this->id; }
	public function getTitle() { return $this->title; }
	public function getGroup() { return $this->group; }
	public function getParent() { return $this->parent; }
	public function getValeur() { return $this->valeur; }
	public function getLinked() { return $this->linked; }
}