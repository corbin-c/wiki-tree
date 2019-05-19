function draw()
{
	link = links.selectAll("line").data(links_data, function(d) { return d.source.id+"-"+d.target.id })

		link.exit().transition().duration(duration/3).style("opacity",0).remove();

		link.transition().duration(duration)
			.attr("x1", function(d) { return d.source.x })
			.attr("x2", function(d) { return d.target.x })
			.attr("y1", function(d) { return d.source.y })
			.attr("y2", function(d) { return d.target.y })
			.attr("stroke-width", 1)
			.attr("stroke", "#999999")
			.attr("stroke-opacity", "0.6")

		link.enter().append("line")
			.attr("x1", function(d) { return d.source.x })
			.attr("x2", function(d) { return d.source.x })
			.attr("y1", function(d) { return d.source.y })
			.attr("y2", function(d) { return d.source.y })
			.attr("stroke-width", 1.5)
			.attr("stroke", "black")
			.attr("stroke-opacity", "1")
			.transition().delay(duration).duration(duration)
				//.attr("stroke-width", 1 )
				.attr("x2", function(d) { return d.target.x })
				.attr("y2", function(d) { return d.target.y })
				.attr("stroke-width", 1)
				.attr("stroke", "#999999")
				.attr("stroke-opacity", "0.6")

		link.merge(link);
		positions = []
		var node = nodes.selectAll("g")
				.data(nodes_data, function(d) { return d.id });
		node.exit().transition().duration(2*duration/3)
			.style("opacity",0)
			.remove();
		node.transition().duration(duration).attr("x", function(d) { return d.x }).attr("y", function(d) { return d.y })
		node.select("circle").style("opacity", 1).transition().duration(duration)
			.attr("cy", function(d) { return d.y })
			.attr("cx", function(d) { return d.x })
			.attr("r",  function(d) {
						positions[d.id] = [d.x,d.y]
						if ((d.group == 1) || (d.group == 3))
						{
							return 5;
						}
						else
						{
						return 2*Math.sqrt(d.value)+3
						}  })
		//console.log(test)
		node.select("text")
				.transition().duration(duration)
				.attr("x", function(d) { return d.x - this.getComputedTextLength() / 2} )
				.attr("y", function(d) { return d.y + 2*Math.sqrt(d.value)+10})
				.style("opacity", 1)

		nu = node.enter().append("g")
			.attr("id",  function(d) { return "id"+d.id })
			.attr("x", function(d) { return d.x })
			.attr("y", function(d) { return d.y })

		nu.append("text")
	      		.text(function(d) {
				strid = d.title
				if (d.group == 1)
				{
					strid = strid.slice(strid.search(":")+1)
				}
			 return strid; })
			.attr("x", function(d) { return d.x - this.getComputedTextLength() / 2} )
			.attr("y", function(d) { return d.y + 2*Math.sqrt(d.value)+10})
			.attr("class", function(d) { return "txt"+d.group })
			.style("opacity",0).transition().delay(duration).duration(duration).style("opacity", 1)
		nu.append("circle")
			.attr("cx", function(d) { if ((typeof d.parent !== 'undefined') && (typeof d.parent !== 'boolean')) { if (typeof positions[d.parent] === 'undefined') { xorigin = d3.select("#id"+d.parent).attr("x") } else { xorigin = positions[d.parent][0] } } else { xorigin = d.x } return xorigin })
			.attr("cy", function(d) { if ((typeof d.parent !== 'undefined') && (typeof d.parent !== 'boolean')) { if (typeof positions[d.parent] === 'undefined') { xorigin = d3.select("#id"+d.parent).attr("y") } else { xorigin = positions[d.parent][1] } } else { xorigin = d.y } return xorigin })
			.attr("r", 5)
			.style("opacity",0)
			.on("click", new_ajax)
			.attr("stroke", "white")
			.transition().delay(duration).duration(duration)
				.attr("r", function(d) {
					if ((d.group == 1) || (d.group == 3))
					{
						return 5;
					}
					else
					{
					return 2*Math.sqrt(d.value)+3
					} })
				.attr("cx", function(d) { return d.x })
				.attr("cy", function(d) { return d.y })
				.style("opacity", 1)
		nu.append("title")
	      		.text(function(d) { return d.title; })

		bi = node.merge(nu)
			bi.select("circle")
				.attr("fill", function(d) { return color(d.group); })
			lgd1 = document.getElementById('lgd1').checked;
			lgd2 = document.getElementById('lgd2').checked;
			show(lgd1,0,2)
			show(lgd2,1,3)	
}
