onmessage = function(e) { load(e.data) }
function load(e,proxy=false)
{
	var url = (proxy) ? e.proxy+e.url:e.url;
	console.log(e,proxy,url)
	var xmlhttp = new XMLHttpRequest();
	
	xmlhttp.responseType = e.type;
	xmlhttp.onreadystatechange = function() {
		console.log(this.readyState,this.status)
		if (this.readyState == 4)
		{
			console.log(this.status,e.cors,url,proxy)
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
					//load(e,true)
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
