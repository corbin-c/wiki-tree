onmessage = function(e) { load(e.data) }
function load(e,proxy=false)
{
	url = (proxy) ? e.proxy+e.url:e.url;
	var xmlhttp = new XMLHttpRequest();
	
	xmlhttp.responseType = e.type;
	xmlhttp.onreadystatechange = function() {
<<<<<<< HEAD
		if (this.readyState == 4)
=======
		console.log(this.readyState,this.status,e.cors,url)
		if ((this.readyState == 4) && (this.status == 200))
>>>>>>> ceeb5f302e196cf8e9c968a7414e764235f21ea9
		{
			if (this.status == 200)
			{
				e.response = xmlhttp.response;
				postMessage(e);
			}
			else if (this.status == 0)
			{
				if ((typeof e.cors === "undefined") || (e.cors == false))
				{
					e.cors = true;
					load(e,true)
				}
			}
		}
	};
	xmlhttp.open("GET", url);
	if (e.headers)
	{
		for (i in e.headers)
		{
			xmlhttp.setRequestHeader(e.headers[i][0],e.headers[i][1]);
		}
	}
	//if (!proxy) { xmlhttp.withCredentials = true; }
	xmlhttp.send();
}
