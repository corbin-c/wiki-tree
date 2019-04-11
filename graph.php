<?php
function graph($tableau,$graphique,$longueur,$links,$deg,$pj)
{
		  $graphique->addNode(
		    $tableau["titre"],
		    array(
		      'URL'   => "javascript:youwig('".$tableau['titre']."')",
		      'label' => mb_strtoupper($tableau["titre"]),
			//'labelloc' => 't',
		      'shape' => 'doublecircle',
		      'color' => '#2e3436',
			'fixedsize'  => TRUE,
			'style' => 'filled',
			'fillcolor' => '#c62f21', 
			'fontsize'  => 16,
			'margin'  => "0.2, 0.2",
			'splines'  => TRUE,
	                'fontname'=>"sans-serif", 
			'overlap'  => FALSE,
			'width' => 1
		    )
		  );
		
		foreach($tableau["catmere"] as $cle => $element)
			{
			$r=rand(00,250);
			$b=rand(0,250);
			$v=rand(0,250);
			  $graphique->addNode(
			    $element["title"],
			    array(
			      //'URL'      => 'http://link2',
 				'URL'      => "wiki.php?projet=".$pj."&cat=".$cle."&liens=".$links."&len=".$longueur."&deg=".$deg,
				'shape' => 'box',
		   		'label' => mb_strtoupper($element["title"]),
				'style' => 'filled',
				'fillcolor' => "#".zeropad(dechex($r),2).zeropad(dechex($v),2).zeropad(dechex($b),2),
				'fixedsize'  => FALSE,
				'fontsize'  => 16,
				'margin'  => "0.4, 0.23",
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
		     	 'shape' => 'circle',
				'style' => 'filled',
				'fillcolor' => '#ffffff',
				'fixedsize'  => TRUE,
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
		      'shape' => 'circle',
				//'fillcolor' => "#dc8850",
				'fillcolor' => "#ffcccc",
				'fixedsize'  => TRUE,
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
