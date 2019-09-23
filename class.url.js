fetcher = new Worker("worker.fetcher.js");
function Url(url,proxy,headers,type) {
  this.url = url;
  this.proxy = proxy;
  this.type = type;
  this.headers = headers;
  this.grab();
}
Url.prototype.grab = function() {
  fetcher.postMessage(this)
  fetcher.addEventListener("message", e => {onWorkerMessage(e)});
  var _this = this;
  function onWorkerMessage(e) {
    if (e.data.url == _this.url) {
      _this.result.call(_this,e.data.response);
    }
  }
}
Url.prototype.result = function(result) {
  this.response = result;
  this.callback(this);
}
Url.prototype.ready = function(func) {
  this.callback = func;
}
