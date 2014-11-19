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
get_yelp_page = \
    lambda zipcode, page_num: \
        'http://www.yelp.com/search?find_desc=&find_loc={0}' \
        '&ns=1#cflt=restaurants&start={1}'.format(zipcode, page_num)

def crawl_page(page_num): 
    page_url = get_yelp_page(61801, page_num)
    soup = BeautifulSoup(urllib2.urlopen(page_url).read())

#    restaurants = soup.findAll('div', attrs={'class':re.compile(r'^search-result natural-search-result')})
    restaurants = soup.findAll('div',{'class': 'search-result'})
    arr = []
    for r in restaurants:
        dic = {}
        title = r.find('a', {'class':'biz-name'}) 
        dic["review_count"] = int(r.find('span', {'class':'review-count'}).get_text().split()[0])
        dic["name"] = title.get_text()
        dic["review_url"] = title.get('href')
        dic["address"] = r.find('div', {'class':'secondary-attributes'}).address.get_text()
        dic["rating"] = r.find('i', {'class':re.compile(r'^star-img')}).img['alt'].split()[0]

        categories = r.findAll('span', {'class':'category-str-list'})
        dic["category"] = map(lambda x: x.getText() if x.getText() else None, categories)

        dic["phone"] = r.find('div', {'class':'secondary-attributes'}).span.getText() 
        arr.append(dic)
    return arr

def crawl_all_pages(num_of_pages):
    total_arr = []
    for i in range(num_of_pages):
        total_arr += (crawl_page(i*10))
        print i
        time.sleep(2)

    print "writing to json file"

    with open('output1.json', 'w') as outfile:
        json.dump(total_arr, outfile, indent=2)

crawl_all_pages(2)

