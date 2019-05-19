<?php
class ExecPile
{
	//Attr
	private $active;
	private $req_list;
	private $queue;

	//C
	public function __construct() {
		$this->active = 0;
		$req_list = array();
		$queue = array();
	}
	//M
	public function toggle_active()
	{
		if ($this->active == 1)
		{
			$this->active = 0;
		}
		else
		{
			$this->active = 1;
		}
	}
	public function add_req($q)
	{
		$this->req_list[] = $q;
	}
	public function add_q($q)
	{
		foreach ($q as $e)
		{
			$this->queue[] = $e;
		}
	}
	public function last_req()
	{
		$e = reset($this->req_list);
		$k = key($this->req_list);
		unset($this->req_list[$k]);
		return $e;
	}
	public function q2x()
	{
		if (count($this->queue) > 0)
		{
			$this->req_list[] = reset($this->queue);
			$k = key($this->queue);
			unset($this->queue[$k]);
		}
	}
	//A
	public function count_req()
	{
		return count($this->req_list);
	}
	public function count_q()
	{
		if (is_array($this->queue))
		{
			return count($this->queue);
		}
		else
		{
			return 0;
		}
	}
	public function is_active()
	{
		return $this->active;
	}
	public function get_list()
	{
		return $this->req_list;
	}
	public function get_q()
	{
		return $this->queue;
	}

}