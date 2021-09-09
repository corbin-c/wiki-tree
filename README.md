# Wiki-Tree

Wiki-Tree is an experimental project by Clément Corbin.
It aims to provide a visual exploration of Wikipedia.

Basically it allows you to perform a search on Wikipedia and it creates a graph
of the found article and its relations to other considering taxonomies and
internal links.

[Wikimedia API](https://www.mediawiki.org/wiki/API:Main_page) is fetched,
rendered using [3d-force-graph library](https://github.com/vasturiano/3d-force-graph),
and wrapped into a React single-page app.

Try it online: <https://corbin-c.github.io/wiki-tree>

/!\ Be warned, Wiki-Tree makes extensive network requests.
