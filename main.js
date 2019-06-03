tree = new Tree(window.location.protocol+"//"+window.location.host);
document.getElementById("submit").addEventListener("click", function(e){
	console.log(document.getElementById("str_search").value)		
	tree.new_node(capital_letter(document.getElementById("str_search").value))
	tree.load_nodes("categories");
})
function capital_letter(str) 
{
	str = str.split(" ");
	for (var i=0,x=str.length;i<x;i++) {str[i]=str[i][0].toUpperCase()+str[i].substr(1);}
	return str.join(" ");
}
