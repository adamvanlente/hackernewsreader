#!/usr/bin/python
# -*- coding: utf-8 -*-

import cgi
import cgitb; cgitb.enable()
import feedparser
import simplejson as json
import urllib
import requests
from readability.readability import Document
import sys

print ''

GOOGLE_API_KEY = '{API_KEY_GOES_HERE}'

# Check for commands.
form = cgi.FieldStorage()
cmd = form.getvalue('cmd')

# Set a list of rss feeds
rss_feeds = ['https://news.ycombinator.com/rss']

# Shorten a url link using Google link shortening API.
def shortUrl(url):
  post_url = 'https://www.googleapis.com/urlshortener/v1/url'
  payload = {'longUrl': url, 'key': GOOGLE_API_KEY}
  headers = {'content-type': 'application/json'}
  r = requests.post(post_url, data=json.dumps(payload), headers=headers)
  print r.text

# Create a string for the article source.  IE www.google.com -> google.com, 
# or www.bbc.co.uk/something -> bbc.co.uk.
def getLinkSource(source):
  source = source.split('://')[1]
  source = source.replace('www.','')
  source = source.split('/')[0]
  return source

# Function for handling news feed stories
def printFeedStories():
  for feed in rss_feeds:
    
    """ Parse the list of stories with feedparser """
    stories = feedparser.parse(feed)
    
    """ Iterate over stories and get shit done """
    if stories.entries:
     story_list = json.dumps(stories.entries)
     print story_list

# Given a url, return an object containing article title, body and url.
def headlineAndBody(url):
  html = urllib.urlopen(url).read()
  readable_title = Document(html).short_title()
  readable_article = Document(html).summary()

  """ Assemble article object """
  article = {}
  article['title'] = readable_title
  article['article_body'] = readable_article
  article['url'] = url
  print json.dumps(article)


""" Commands """

try:

  """ Return a json object with a list of stories """
  if cmd == 'stories':
    printFeedStories()

  """ Return headline and story body for a news article url """
  if cmd == 'url':
    url = form.getvalue('url')
    headlineAndBody(url)

  """ Return a short url for a link using Google's url shortener """
  if cmd == 'short':
    url = form.getvalue('url')
    shortUrl(url)

except:

  response = {}
  response['success'] = False
  response['error'] = sys.exc_info()[0]
  print json.dumps(response)
