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
get_yelp_page = lambda zipcode, page_num: 'http://www.yelp.com/search?find_desc=Restaurants&find_loc={0}&ns=1&start={1}'.format(zipcode, page_num)

def crawl_page(page_num): 
    page_url = get_yelp_page(61801, page_num)
    print page_url
    soup = BeautifulSoup(urllib2.urlopen(page_url).read())

#    restaurants = soup.findAll('div', attrs={'class':re.compile(r'^search-result natural-search-result')})
    restaurants = soup.findAll('div',{'class': 'search-result'})
    arr = []
    for r in restaurants:
        dic = {}
        title = r.find('a', {'class':'biz-name'}) 
        try:
            dic["review_count"] = int(r.find('span', {'class':'review-count'}).get_text().split()[0])
        except Exception, e:
            dic["review_count"] = 0

        try:
            dic["name"] = title.get_text()
        except Exception, e:
            dic["name"] = "FAIL"

        try:
            dic["review_url"] = title.get('href')
        except Exception, e:
            dic["review_url"] = "FAIL"

        try:
            dic["address"] = r.find('div', {'class':'secondary-attributes'}).address.get_text()
        except Exception, e:
            dic["address"] = "FAIL"

        try:
            dic["rating"] = r.find('i', {'class':re.compile(r'^star-img')}).img['alt'].split()[0]
        except Exception, e:
            dic["rating"] = "FAIL"

        try:
            categories = r.findAll('span', {'class':'category-str-list'})
            dic["category"] = map(lambda x: x.getText() if x.getText() else None, categories)
        except Exception, e:
            dic["category"] = "FAIL"

        try:
            dic["phone"] = r.find('div', {'class':'secondary-attributes'}).span.getText() 
        except Exception, e:
            dic["phone"] = "FAIL"

        arr.append(dic)
    return arr

def remove_duplicate(arr):
    ret = []
    name_set = []
    arr.sort()
    for i in range(len(arr)):
        if arr[i]["name"] not in name_set:
            name_set.append(arr[i]["name"])
            ret.append(arr[i])
    return ret

def crawl_all_pages(num_of_pages):
    total_arr = []
    for i in range(num_of_pages):
        total_arr += (crawl_page(i*10))
#        print i
        time.sleep(2)

    print "writing to json file"
    total_arr = remove_duplicate(total_arr)
    with open('output1.json', 'w') as outfile:
        json.dump(total_arr, outfile, indent=2)

crawl_all_pages(43)

