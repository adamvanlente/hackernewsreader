/* Namespace for Hacker News Reader app
 */
var hn = {

  // All hnr urls.
  feedRequestUrl: '/api/v1/reader.py?cmd=stories',
  storyRequestUrl: '/api/v1/reader.py?cmd=url&url=',
  shortUrlRequest: '/api/v1/reader.py?cmd=short&url=',

  /* Get the latest stories for Hacker News.
   * Make a call to the API and return a response that lists
   * the top stories currently on Hacker News.
   */
  loadStories: function() {
    $.ajax({
       url: hn.feedRequestUrl,
       type: 'GET',
       success: function(data){
           hn.handleFeed(JSON.parse(data));
       },
       error: function(data) {
          var message = 'Error getting news from HN.';
          console.log(message);
       }
    });
  },

  /* Given an object of recent stories, iterate over them
   * and give each one an element in the UI.
   */
  handleFeed: function(stories) {
   var storyDiv = utils.get('stories');
   for (var i = 0; i < stories.length; i++) {
    var article = {};
    var story = stories[i];
    article.link = story.link;
    article.title = story.title;
    var source = story.link;
    article.source = source.split('//')[1].split('/')[0].replace('www.','');
    var link = hn.renderArticleLink(article);
    storyDiv.appendChild(link);
   }
  },

  /* Given argument article object, create a list item
   * that - when clicked - will display the article.
   */
  renderArticleLink: function(article) {
   var link = utils.make('div');
   link.className = 'link';
   link.onclick = (function(article) {
      return function() {
          hn.getStoryUrl(article);
        };
      })(article);

   var span = utils.make('span');
   var label = utils.make('label');
   var em = utils.make('em');

   label.innerHTML = article.title;
   em.innerHTML = article.source;
   span.appendChild(label);
   span.appendChild(em);
   link.appendChild(span);
   return link;
  },

  // Request a story when a user clicks on an item.
  getStoryUrl: function(article) {
    // Hold a record of the Title and Source.
    hn.latestTitle = article.title;
    hn.latestSource = article.source;

    // Show loading screen while the story is fetched.    
    var url = article.link;
    utils.show('loadscreen');

    // Get the story body with an ajax request.
    hn.requestStory(url);
    document.body.style.overflow = 'hidden';
  },

  /* Given a url to a story, request the story title
   * and body.
   */
  requestStory: function(url) {
    $.ajax({
       url: hn.storyRequestUrl + url,
       type: 'GET',
       success: function(data){
          data = JSON.parse(data);
          hn.displayStory(data);
          utils.hide('loadscreen');
       },
       error: function(data) {
          var message = 'There was an error fetching this story.';
          alert(message);
          utils.hide('loadscreen');
       }
    });
  },

  /* Given argument story (object), display the story in the UI.
   */
  displayStory: function(story) {
    
    // Some dom elements.
    var body = story.article_body;
    var titleHolder = utils.get('story-title');
    var bodyHolder = utils.get('story-body');
    var sourceHolder = utils.get('story-source');

    // Fill the elements with content.
    utils.fill(titleHolder, hn.latestTitle);
    hn.newWindowButton(titleHolder, story.url);
    utils.fill(bodyHolder, body);
    utils.fill(sourceHolder, hn.latestSource);

    // Scroll to the top of the story holder and make it visible.
    utils.get('story').scrollTop = 0;
    utils.classify('story', 'hnr-story visible');
    utils.show('story-close');
    utils.get('story-buttons').className = 'story-buttons visible';

    // Get a short url and load social buttons.
    var div = utils.get('story-buttons');
    utils.empty(div);
    hn.getShortUrl(div, story.url);
  },

  // Fetch a short version of the story link for social buttons.
  getShortUrl: function(div, link) {
    $.ajax({
       url: hn.shortUrlRequest + link,
       type: 'GET',
       success: function(data){
          data = JSON.parse(data);

          // Load social buttons to story 
          hn.twitterButton(div, data.id);
          hn.facebookButton(div, data.id);
       },
       error: function(data) {
          // pass
       }
    });
  },

  // Make a twitter button.  Assign it a link and place it in the social buttons div.
  twitterButton: function(div, url) {
    var link = utils.make('a');
    var string = hn.latestTitle + ': ' + url + ' %23hackernews via hackernewsreader.com';
    link.href = 'https://twitter.com/intent/tweet?text=' + string;
    link.innerHTML = 'twitter';
    link.className = 'hnr-twitter-button hnr-share-button';
    link.target = '_new';
    div.appendChild(link);
  },

  // Make a facebook button.  Assign it a link and place it in the social buttons div.
  facebookButton: function(div, url) {
    var link = utils.make('a');
    link.href = 'https://www.facebook.com/sharer/sharer.php?u=' + url +
        '&t=' + hn.latestTitle;
    link.innerHTML = 'facebook';
    link.className = 'hnr-facebook-button hnr-share-button';
    link.target = '_new';
    div.appendChild(link);
  },

  // Button to open article in new window.
  newWindowButton: function(div, url) {
    var link = utils.make('a');
    link.href = url;
    link.innerHTML = 'open in new tab';
    link.className = 'hnr-new-window-button hnr-share-button';
    link.target = '_new';
    div.appendChild(link);
  },

  // Close an open story, return to the main list of stories.
  closeStory: function() {
    utils.classify('story', 'hnr-story invisible');
    utils.hide('story-close');
    utils.get('story-buttons').className = 'story-buttons invisible';
    document.body.style.overflow = '';
  }

};

hn.loadStories();