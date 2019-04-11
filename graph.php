<?php
function graph($tableau,$graphique,$longueur,$links,$deg,$pj)
{
		  $graphique->addNode(
		    $tableau["titre"],
		    array(
		      'URL'   => "javascript:youwig('".$tableau['titre']."')",
		      'label' => $tableau["titre"],
		      //'shape' => 'box',
		      'color' => '#2e3436',
			'fixedsize'  => FALSE,
			'style' => 'filled',
			'fillcolor' => '#c62f21', 
			'fontsize'  => 16,
			'margin'  => "0.2, 0.2",
			'splines'  => TRUE,
	                'fontname'=>"sans-serif", 
			'overlap'  => FALSE
		    )
		  );
		
		foreach($tableau["catmere"] as $cle => $element)
			{
			$r=rand(40,255);
			$b=rand(40,255);
			$v=rand(40,255);
			  $graphique->addNode(
			    $element["title"],
			    array(
			      //'URL'      => 'http://link2',
 				'URL'      => "wiki9.php?projet=".$pj."&cat=".$cle."&liens=".$links."&len=".$longueur."&deg=".$deg,
				'shape' => 'box',
				'style' => 'filled',
				'fillcolor' => "#".zeropad(dechex($r),2).zeropad(dechex($v),2).zeropad(dechex($b),2),
				'fixedsize'  => FALSE,
				'fontsize'  => 16,
				'margin'  => "0.2, 0.2",
				'splines'  => TRUE,
	                        'fontname'=>"sans-serif", 
				'overlap'  => FALSE,
			    )
			  );
			$graphique->addEdge(
			    array(
			      $tableau["titre"] => $element["title"]),
			   array('arrowsize' => 0.3,
			   'sametail' => TRUE,
			   'color' => '#2e3436',
			   'len'  => $longueur+2)
			   
			   );
		foreach($element["filles"] as $k => $elt)
			{
		$graphique->addNode(
			    $elt["title"],
			    array(
			      'URL'      => "javascript:youwig('".$elt["title"]."')",
				'fixedsize'  => FALSE,
				'fontsize'  => 16,
				'margin'  => "0.2, 0.2",
				'splines'  => TRUE,
       		                'fontname'=>"sans-serif", 
				'overlap'  => FALSE,
				'color' => '#2e3436',
			    )
			  );
			$graphique->addEdge(
			    array(
			      $elt["title"] => $element["title"]),
			    array('arrowsize' => 0.3,
			   	'sametail' => FALSE,
				'color' => "#".zeropad(dechex($r),2).zeropad(dechex($v),2).zeropad(dechex($b),2),
			   	'len'  => $longueur+4,
				)
			   );
				if (isset($elt["fils"]))
				{
					graph($tableau["catmere"][$cle]["filles"][$k]["fils"],$graphique,$longueur,$links,$deg,$pj);
				}
			}
			//if ($r+$couleurdiff < 220) {$r = $r+$couleurdiff;}
			//elseif ($v+$couleurdiff < 240) {$v = $v+$couleurdiff;}
			//elseif ($b+$couleurdiff < 255) {$b = $b+$couleurdiff;}

			//echo "rouge:".$r."vert".$v."bleu:".$b."<br/>";
		}
		if ($links == "on")
		{
			foreach($tableau["liens"] as $cle => $element)
			{
			    $graphique->addNode(
			    $element["title"],
			    array(
			      'URL'      => "javascript:youwig('".$element["title"]."')",
				'style' => 'filled',
				'fillcolor' => "#dc8850",
				'fixedsize'  => FALSE,
				'fontsize'  => 16,
				'margin'  => "0.2, 0.2",
				'splines'  => TRUE,
  		                'fontname'=>"sans-serif", 
				'overlap'  => TRUE,
			    )
			  );
			$graphique->addEdge(
			    array(
			      $tableau["titre"] => $element["title"]),
			   array('arrowsize' => 0.3,
			   'sametail' => TRUE,
			   'len'  => $longueur,
				'color' => '#2e3436',
				'id' => "fille")
			   );
				if (isset($element["fils"]))
				{
					graph($tableau["liens"][$cle]["fils"],$graphique,$longueur,$links,$deg,$pj);
				}
			}
		}
}
?>
