from BeautifulSoup import BeautifulSoup
from urlparse import urljoin
import urllib2
import argparse
import re
import codecs
import time
import random

'''
get_yelp_page = \
    lambda zipcode, page_num: \
        'http://www.yelp.com/search?find_desc=&find_loc={0}' \
        '&ns=1#cflt=restaurants&start={1}'.format(zipcode, page_num)
        '''

get_yelp_page = \
    lambda zipcode, page_num: \
        'http://www.yelp.com/search?find_desc=&find_loc={0}&ns=1#start={1}&cflt=restaurants'.format(zipcode, page_num)

def crawl_page(zipcode, page_num, verbose=False):
  #page_url = 'http://www.yelp.com/search?find_desc=Restaurants&find_loc=61801&ns=1&start=30'
  page_url = get_yelp_page(zipcode, page_num)
  soup = BeautifulSoup(urllib2.urlopen(page_url).read())
  print(soup.prettify())

crawl_page(61801, 30)
