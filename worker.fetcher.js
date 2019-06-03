onmessage = function(e) { load(e.data) }
function load(e,proxy=false)
{
	url = (proxy) ? e.proxy+e.url:e.url;
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.responseType = e.type;
	xmlhttp.onreadystatechange = function() {
		if ((this.readyState == 4) && (this.status == 200))
		{
			e.response = xmlhttp.response;
			postMessage(e);
		}
		/*else if (((this.readyState == 4) && (this.status == 0)) && ((typeof e.cors === "undefined") || (e.cors == false)))
		{
			e.cors = true;
			load(e,true)
		}*/
	};
	xmlhttp.open("GET", url);
	xmlhttp.send();
}
