if(Meteor.isClient) {
  Meteor.startup(function() {

    var routes = {
      '/login': Login,
      '/:route...': Synergy
    }
    var images = ['img/cardboard.jpg', 'img/paper.jpg', 'img/wood.jpg', 'img/papyrus.jpg', 'img/vintage.jpg', 'img/stone.jpg']
    document.body.style.backgroundImage = 'url(' + 
      images[Math.floor(Math.random()*images.length)] + ')'

    m.route.mode = "hash"
    m.route(document.body, '/', routes)
  })
}

