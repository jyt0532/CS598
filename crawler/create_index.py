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
import unicodedata

get_yelp_page = lambda zipcode, page_num: 'http://www.yelp.com/search?find_desc=Restaurants&find_loc={0}&ns=1&start={1}'.format(zipcode, page_num)

def crawl_page(page_num): 
    page_url = get_yelp_page(61801, page_num)
    print page_url
    soup = BeautifulSoup(urllib2.urlopen(page_url).read())

#    restaurants = soup.findAll('div', attrs={'class':re.compile(r'^search-result natural-search-result')})
    restaurants = soup.findAll('div',{'class': 'natural-search-result'})
    arr = []

    for r in restaurants:
        dic = {}
'''        price = r.find('span', {'class': 'price-range'}).string
        try:
            dic["price"] = price
        except:
            dic["price"] = 0;'''
        title = r.find('a', {'class':'biz-name'}) 

        try:
            dic["photo_url"] = r.find('img', {'class' :'photo-box-img'}).get('src')
        except Exception, e:
            dic["photo_url"] = "FAIL"

        try:
            dic["price"] = len(r.find('span', {'class':'price-range'}).string)
        except Exception, e:
            dic["price"] = 0

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
            ori = r.find('div', {'class':'secondary-attributes'}).address
            address = [ori.next.string.strip()]
            address = address + [ori.next.next.next.string.strip()]
            dic["address"] = address
        except Exception, e:
            dic["address"] = "FAIL"

        try:
            dic["rating"] = r.find('i', {'class':re.compile(r'^star-img')}).img['alt'].split()[0]
        except Exception, e:
            dic["rating"] = "FAIL"

        try:
            categories = r.findAll('span', {'class':'category-str-list'})
            dic["category"] = [re.sub('[ \n]','', c.get_text()).split(',') for c in categories if c.getText()][0]
        except Exception, e:
            dic["category"] = "FAIL"

        try:
            dic["phone"] = r.find('span', {'class':'biz-phone'}).getText().strip()
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

<<<<<<< HEAD
crawl_all_pages(1)
=======
crawl_all_pages(36)
>>>>>>> origin/master

