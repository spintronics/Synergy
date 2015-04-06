if(Meteor.isClient) {
  Meteor.startup(function() {
    window.model = {
      getTopics: function() {
        return Topics.find().fetch()
      },
      addTopic: function(name) {
        if(!Topics.find({name: name}).fetch().length){
          Topics.insert({
            name: name,
            content: []
          })
        }
      },
      addContent: function(content, path) {
        path = path.split('/')
        var topic = Topics.find({name: path[0]})
        debugger
        var topic = topic.find({name: path[1]}).fetch()
      }
    }

    window.routes = {
      '/login': Login
      , '/topics': headTopics
      // , '/synergy/:topic': Topic
      , add: function(route, component) {
      }
    }

    m.route.mode = "hash"
    m.route(document.body, '/', routes)




    //m.module(document.getElementsByClassName('playContainer')[0], Player)
  })
}

// var topic = {
//   name: 'Mithril',
//   content: [
//     {
//       name: 'modules',
//       content: [
//         'require user and controller',
//         {
//           name: 'unloading',
//           content: [
//             'this.onunload',
//             'Fly McQueen'
//           ]
//         },
//         'Render Bender'
//       ]
//     },
//     'Big Data'
//   ]
// }




