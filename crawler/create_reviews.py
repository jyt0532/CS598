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
    review_div = soup.findAll("div", {"class": "review--with-sidebar"})
    for elem in review_div:
        current_review = {}
        current_review["review"] = elem.p.get_text()
        current_review["rating"] = elem.div.findNext("meta", {"itemprop": "ratingValue"})["content"]
        current_review["user-name"] = elem.div.nextSibling.findNext("a", {"class": "user-display-name"}).get_text()
        current_review["user-location"] = elem.div.findNext("li", {"class": "user-location"}).get_text()
        current_review["date"] = elem.div.findNext("meta", {"itemprop": "datePublished"})["content"]
        reviews_arr.append(current_review)
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

