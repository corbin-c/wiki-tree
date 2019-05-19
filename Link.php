<?php
class Link
{
	private static $_i = 0;
	private $source_id;
	private $target_id;
	private $strength;
	private $id;
//C
	// Le lien est créé à partir d'une source et d'une cible. Chacun renvoie à un objet de classe Node identifié par son id
public function __construct($src,$tgt,$sg = 0,$id = 0) {
	self::$_i++;
	$this->id = Link::get_current_i();
	$this->source_id = $src;
	$this->target_id = $tgt;
	$this->strength = $sg;
	if ($id !=0) { $this->id = $id; }
}

//M
	// Target ID
	public function setTarget($tgt) { $this->target_id = $tgt; }
	public function setLocal($lc) { $this->localisation = $lc; }
	public static function set_i($g) { self::$_i = $g; }
//A
	public static function get_current_i() { return self::$_i; }
	public function getId() { return $this->id; }	
	public function getSource() { return $this->source_id; }
	public function getTarget() { return $this->target_id; }
	public function getStrength() { return $this->strength; }
}