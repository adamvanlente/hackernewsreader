#Hacker News Reader

I like to keep up with Hacker News each day, but their site is difficult to navigate on mobile devices.  There are plenty of Hacker News readers out there, some more <a href="http://hn.premii.com/" target="new">impressive</a> than others.  However, I needed an excuse to play with some Python modules I was interested in, namely Readability and feedparser for rss feeds.  My goal was to build a simple web app that let me quickly check the Hacker News headlines throughout the day.  Check it out here: http://www.hackernewsreader.com.

### File Structure

<pre>
-hackernewsreader
  /cgi
    reader.py : parses feeds, returns json objects for list of stories and individual stories.
  /html
    index.html
    README.md
    /css : styles using sass
      _sass_globals.js
      style.sass
    /images
      apple-touch-icon-iphone-precomposed.png
      favicon.ico
      spiffygif_44x44.gif : loading gif
    /js
      jquery.js : v1.10.0
      script.js : makes calls to hnr 'api' and renders json data in the browser
      utils.js : quick dom manipulation
</pre>