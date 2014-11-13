from bs4 import BeautifulSoup
import urllib2


soup = BeautifulSoup(urllib2.urlopen("http://www.yelp.com/biz/black-dog-smoke-and-ale-house-urbana").read())

#print(soup.find_all("p",{ "itemprop" : "description" }))
arr = soup.find_all("p",{ "itemprop" : "description" })
for elem in arr:
	print elem.contents
