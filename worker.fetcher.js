onmessage = (e) => { load(e.data) }
function load(e,proxy=false) {
  let url = (proxy) ? e.proxy+e.url:e.url;
  let xmlhttp = new XMLHttpRequest();
  xmlhttp.responseType = e.type;
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {
        e.response = xmlhttp.response;
        postMessage(e);
      } else if (this.status == 0) {
        if ((typeof e.cors === "undefined") || (e.cors == false)) {
          e.cors = true;
          load(e,true)
        }
      }
    }
  };
  xmlhttp.open("GET", url);
  if (e.headers) {
    for (i in e.headers) {
      xmlhttp.setRequestHeader(e.headers[i][0],e.headers[i][1]);
    }
  }
  xmlhttp.send();
}
