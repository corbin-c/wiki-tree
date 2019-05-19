# dat-tree
Dat-tree is a project by Clément Corbin. It aims to provide visual exploration for semantic links between Wikipedia pages.
It relies on [Mediawiki API](https://www.mediawiki.org/wiki/API:Main_page) as a data source and depends on [Mike Bostock's D3.js](https://d3js.org/).

To try Dat-Tree, you need PHP or a server. Just git clone, deploy to your server (or start a temporary development server e.g `php -S localhost:8080` ) and simply browse to it. Main view is `vue.php`. If you're working on a local server, just go to `localhost:8080/vue.php`.

Currently, Dat-Tree doesn't handle redirections, which means you have to search for content with **exact match**, case-sensitive. If you're looking for French writer Boris Vian, you have to search exactly for *Boris Vian*. *boris vian* won't work and *bison ravi* neither.

Don't worry, Dat-Tree is an experimental project. Sometimes it might get stuck and flood your memory and/or bandwidth... Hmm ok, maybe you should worry. As for now, Dat-Tree is not production-ready and should absolutely not be deployed on a publicly accessible server.
