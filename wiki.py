#!/usr/bin/python
# -*- coding: iso-8859-15 -*-
### MODULE POUR TROUVER LES CATEGORIES FILLLES ###
import urllib, re       # import des modules a partir de la bibliotheque d'instructions de base, 
nom_de_page = "Catégorie:Musique" #             'urllib' pour URL library et 're' pour regular expression.
url = "http://fr.wikipedia.org/w/api.php?action=query&cmtitle=%s&format=xml&cmlimit=500&list=categorymembers" % nom_de_page
page = urllib.urlopen(url) 
infos = page.read()
page.close()
print "Les informations demandees concernant", nom_de_page, "sont les suivantes, en XML :\n\n", infos 
print "\n...recherche l'expression rationnelle..." 
reviseur= re.findall(' user="(.*?)" ',infos)
print "\nDernier reviseur : ",reviseur

 