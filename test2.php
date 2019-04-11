<?php
ini_set('memory_limit', '1024M');
$max = 0;
include("../graphjs.php");
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
				$tableau[$k]["children"] = wikiquery2($e["title"],"fr");
				$tableau[$k]["children"] = dvlp($tableau[$k]["children"],$lg);
			}
		}
	}
	return $tableau;
}
//echo "<pre>";
if (isset($_POST["rech"]))
{
	/*if (!(is_numeric($_POST['degre']))) { $degre = 0; } else { $degre = $_POST['degre']; }
	$proj = $_POST['projet'];
	$q = $_POST["rech"];
	$arbre = wikiquery($q,$proj);
	$arbre = get_id($arbre,$proj);
	$arbre = dvlp($arbre,$proj);
	file_put_contents("cache.json", json_encode($arbre));*/
}
if (!(isset($degre))) { $degre = 2; }
/*$q = "Peter Saville (graphic designer)";
$proj = "en";
$arbre = wikiquery($q,$proj);
$arbre = get_id($arbre,$proj);
$arbre = dvlp($arbre,$proj);
file_put_contents("cache.json", json_encode($arbre));*/
$arbre = json_decode(file_get_contents("cache.json"),true);
foreach($arbre["categories"] as $cle => $element)
{
	foreach($element["children"] as $k => $elt)
	{
		if (!doublons($elt,$degre,$arbre))
		{
			unset($arbre["categories"][$cle]["children"][$k]);
		}
	}
}

//$arbre["categories"][0]["children"][14]["children"][2] = wikiquery($arbre["categories"][0]["children"][14]["children"][2]["title"],$proj);
//$arbre["categories"][0]["children"][14]["children"][2] = dvlp($arbre["categories"][0]["children"][14]["children"][2],$proj);
//var_export($arbre);
//echo "</pre>";
?>
<!DOCTYPE html>
<html>
<head>
    <script type="text/javascript" src="../visjs/dist/vis.js"></script>
    <link href="../visjs/dist/vis.css" rel="stylesheet" type="text/css" />

   <style type="text/css">
        #mynetwork {
            //width: 100%;
            height: 100%;
            border: 1px solid lightgray;
        }
        #loadingBar {
            position:absolute;
            top:0px;
            left:0px;
            width: 902px;
            height: 902px;
            background-color:rgba(200,200,200,0.8);
            -webkit-transition: all 0.5s ease;
            -moz-transition: all 0.5s ease;
            -ms-transition: all 0.5s ease;
            -o-transition: all 0.5s ease;
            transition: all 0.5s ease;
            opacity:1;
        }
        #wrapper {
            position:relative;
            width:900px;
            height:900px;
        }

        #text {
            position:absolute;
            top:8px;
            left:530px;
            width:30px;
            height:50px;
            margin:auto auto auto auto;
            font-size:22px;
            color: #000000;
        }


        div.outerBorder {
            position:relative;
            top:400px;
            width:600px;
            height:44px;
            margin:auto auto auto auto;
            border:8px solid rgba(0,0,0,0.1);
            background: rgb(252,252,252); /* Old browsers */
            background: -moz-linear-gradient(top,  rgba(252,252,252,1) 0%, rgba(237,237,237,1) 100%); /* FF3.6+ */
            background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(252,252,252,1)), color-stop(100%,rgba(237,237,237,1))); /* Chrome,Safari4+ */
            background: -webkit-linear-gradient(top,  rgba(252,252,252,1) 0%,rgba(237,237,237,1) 100%); /* Chrome10+,Safari5.1+ */
            background: -o-linear-gradient(top,  rgba(252,252,252,1) 0%,rgba(237,237,237,1) 100%); /* Opera 11.10+ */
            background: -ms-linear-gradient(top,  rgba(252,252,252,1) 0%,rgba(237,237,237,1) 100%); /* IE10+ */
            background: linear-gradient(to bottom,  rgba(252,252,252,1) 0%,rgba(237,237,237,1) 100%); /* W3C */
            filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#fcfcfc', endColorstr='#ededed',GradientType=0 ); /* IE6-9 */
            border-radius:72px;
            box-shadow: 0px 0px 10px rgba(0,0,0,0.2);
        }

        #border {
            position:absolute;
            top:10px;
            left:10px;
            width:500px;
            height:23px;
            margin:auto auto auto auto;
            box-shadow: 0px 0px 4px rgba(0,0,0,0.2);
            border-radius:10px;
        }

        #bar {
            position:absolute;
            top:0px;
            left:0px;
            width:20px;
            height:20px;
            margin:auto auto auto auto;
            border-radius:11px;
            border:2px solid rgba(30,30,30,0.05);
            background: rgb(0, 173, 246); /* Old browsers */
            box-shadow: 2px 0px 4px rgba(0,0,0,0.4);
        }
    </style>


<script type="text/javascript">
function cache(evt) {
	var x = evt.target;
	alert(x.parentNode.firstChild);
}

document.getElementById.addEventListener("mouseover",cache,false);
        function draw() {
<?php graph($arbre); ?>
	// create a network
	var container = document.getElementById('mynetwork');

	// provide the data in the vis format
	var data = {
		nodes: nodes,
		edges: edges
	};
	var options = {
		nodes: {
			shape: 'dot',
			size: 16
		},
		layout:{
			randomSeed:34
		},
		physics: {
			forceAtlas2Based: {
				gravitationalConstant: -26,
				centralGravity: 0.005,
				springLength: 230,
				springConstant: 0.18
			},
		maxVelocity: 146,
		solver: 'forceAtlas2Based',
		timestep: 0.35,
		stabilization: {
			enabled:true,
			iterations:2000,
			updateInterval:25
		}
	}
	};
	var network = new vis.Network(container, data, options);

	network.on("stabilizationProgress", function(params) {
	var maxWidth = 496;
	var minWidth = 20;
	var widthFactor = params.iterations/params.total;
	var width = Math.max(minWidth,maxWidth * widthFactor);

	document.getElementById('bar').style.width = width + 'px';
	document.getElementById('text').innerHTML = Math.round(widthFactor*100) + '%';
	});
	network.once("stabilizationIterationsDone", function() {
	document.getElementById('text').innerHTML = '100%';
	document.getElementById('bar').style.width = '496px';
	document.getElementById('loadingBar').style.opacity = 0;
	// really clean the dom element
	setTimeout(function () {document.getElementById('loadingBar').style.display = 'none';}, 500);
	});
}
</script>
</head>
<body onload="draw()">
<div id="wrapper">
    <div id="mynetwork"></div>
    <div id="loadingBar">
        <div class="outerBorder">
            <div id="text">0%</div>
            <div id="border">
                <div id="bar"></div>
            </div>
        </div>
    </div>
</div>
<form action="test2.php" method="POST" style="width:220px; border:1px solid grey; position: absolute; top:15px; left: 15px; font: 0.8em;">
<label>Recherche : <input type="text" id="rech" name="rech" /></label><br/>
<label>Similarité :<input type="number" id="degre" name="degre" min="1" max="10" /></label><br/>
<label>Langue<select id="projet" name="projet">
    <option value="fr">Français</option>
    <option value="en">Anglais</option>
    <option value="es">Espagnol</option>
    <option value="pt">Portugais</option>
</select>
<input type="submit" />
</form>
</body>
</html>