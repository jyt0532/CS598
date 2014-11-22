#from BeautifulSoup import BeautifulSoup
from bs4 import BeautifulSoup
from urlparse import urljoin
import urllib2
import argparse
import re
import codecs
import time
import random
import json
import time
import math
def append_reviews_from_page_url(restaurant_reviews, page_url, name):
    if not restaurant_reviews:
        restaurant_reviews["name"] = name
        reviews_arr = []
    else:
        reviews_arr = restaurant_reviews["reviews"]

    soup = BeautifulSoup(urllib2.urlopen(page_url).read())
    #print soup.prettify()
    page_reviews = soup.findAll("p", {"itemprop": "description"})
    for elem in page_reviews:
#        print elem.get_text()
        reviews_arr.append(elem.get_text())
    restaurant_reviews["reviews"] = reviews_arr

def crawl_reviews(): 
    default_url = "http://www.yelp.com"
    json_data = json.loads(open("data/restaurant_index_3.json").read())
    total_reviews = []
    count = 0
    for elem in json_data:
        num_of_reviews = elem["review_count"]
        restaurant_reviews = {}
        for i in range(int(math.ceil(num_of_reviews/40))):
            page_url = default_url + elem["review_url"] + "?start=" + str(i*40)
            append_reviews_from_page_url(restaurant_reviews, page_url, elem["name"])
        total_reviews.append(restaurant_reviews)
        count = count + 1
        print count
    with open('reviews.json', 'w') as outfile:
       json.dump(total_reviews, outfile, indent=2)
crawl_reviews()

