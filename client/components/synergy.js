Synergy = {






  model: {
    getTopic: function(route, name) {
      if(name) {
        return Topics.find({route: route, name: name}).fetch()
      } else {
        return Topics.find({route: route}).fetch()
      }
    },
    addTopic: function(name, route) {
      var topic = this.getTopic(route, name)
      if(!topic.length) Topics.insert({route: route, name: name, content: []})
    },
    addContent: function(content, route, name) {
      var topic = this.getTopic(route, name)
      if(!topic.length) return
      var topicId = topic[0]._id
      Topics.update({_id: topicId}, {$push:{content: content}})
    },
    getContent: function(route, name) {
      var result = Topics.find({route: route, name: name}).fetch()
      return result.length ?
        result[0].content
      : []
    },
    showing: m.prop({}),
    urlRegex: new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?"),
    focus: m.prop({})

  },

















  controller: reactive(function() {
    ctrl = this
    ctrl.css = Synergy.stylesheet().classes
    ctrl.showing = Synergy.model.showing()
    ctrl.route = m.route()
    ctrl.topics = Synergy.model.getTopic(ctrl.route)
    ctrl.content = Synergy.model.getContent(ctrl.route)
    ctrl.focus = Synergy.model.focus()
    ctrl.toggleTopic = function(topicName) {
      var showing = ctrl.showing
      if(showing[topicName]) {
        delete showing[topicName]
        Synergy.model.showing(showing)
      } else {
        var obj = {}
        obj[topicName] = ctrl.route === '/'  ?
          '/' + topicName
          : ctrl.route + '/' + topicName
        Synergy.model.showing(_.extend(showing, obj))
      }
    }
    return ctrl
    // m.route.param('itemPath')
  }),












  view: function(ctrl) {
    var showing = ctrl.showing
    
    attr = {
      main: {
        class: ctrl.css.main
      },
      content: {
        class: ctrl.css.content
      },
      drillTopic: function(route){
        return {
          class: ctrl.css.drillTopic,
          config: m.route,
          href: route
        }
      },
      subTopicName: function(route){
        return {
          class: ctrl.css.subTopicName,
          config: m.route,
          href: route
        }
      },
      topicName: function(name){
        return {
          class: ctrl.css.topicName,
          onclick: ctrl.toggleTopic.bind(null, name)
        }
      },
      link: function(path) {
        return {
          config: m.route,
          href: path.route,
          style: path.style
        }
      }
    }













    return m('div.main', attr.main, [
      //
      // Build top path
      //
      (function() {
        var paths = parseRoute(ctrl.route)
        return m('span', [
          m('a', {
            config: m.route,
            href: '/'
          }, 'Synergy'),
          paths.map(function(path, dex) {
            if(!dex) return
            return m('span', [
              ' > ',
              m('a', attr.link(path), path.name)
            ])
          })
        ])
      })(),


      m('hr'),

      //
      // Render subTopics
      //
      Synergy.model.getTopic(ctrl.route).map(function(topic) {
        return m('div.topic', [
          m('a.drillTopic', attr.drillTopic(
            ctrl.route === '/' ?
              ctrl.route + topic.name
            : ctrl.route + '/' + topic.name
          ), '@'),
          m('span.topicName', attr.topicName(topic.name), topic.name),

          //
          // if current subTopic is showing then show it's subpath
          //

          showing[topic.name] ?
            (function() {
              var topics = Synergy.model.getTopic(
                ctrl.route === '/' ?
                  '/' + topic.name
                : ctrl.route + '/' + topic.name
              )
              return m('div', [
                topics.map(function(topic) {
                  return m('span.subTopics', [
                    m('a.subTopicName', attr.subTopicName(
                      topic.route + '/' + topic.name
                    ), [topic.name]),
                    ' > '
                  ])
                })         
              ])  
            })()
          : null,
          //
          // if topic is showing render sub-content
          // 
          showing[topic.name]?
            (function() {
              var content = Synergy.model.getContent(ctrl.route, topic.name)
              var topics = Synergy.model.getTopic(ctrl.route + topic.name)
              return m('ul.content', [
                content.map(function(lemon) {
                  return m('li[contenteditable]', attr.content, testForLink(lemon))
                }),
                newContentView(ctrl.route, topic.name),
                newTopicView(
                  ctrl.route === '/' ?
                    '/' + topic.name
                  : ctrl.route + '/' + topic.name
                )
              ])  
            })()
          : null,
        ])
      }),
      //
      // Render current path content
      //
      (function() {
        var route = ctrl.route.split('/')
        var topic = route.splice([route.length - 1], 1)
        route = route.join('/')
        if(route === '') route = '/'
        var result = Synergy.model.getContent(route, topic[0])
        if(result.length)result = result.map(function(orange) {
          return m('span[contenteditable]', attr.content, [testForLink(orange), m('br')])
        })
        return m('div.content', [
          result,
          ctrl.route === '/' ?
            null
          : newContentView(route, topic[0]),
          newTopicView(ctrl.route)
        ])
      })()
    ])

    
  },












  styles: {
    main: {
      'width': '75%',
      'padding': '1.5em',
      'margin': '1.5em auto 1.5em auto',
      'background-color': 'rgba(255,255,255,0.75)',
      'border-radius': '30px',
      'box-shadow': '0px 0px 3em 1em black'
    },
    topicContainer: {
    },
    topic: {
    },
    drillTopic: {
      'text-decoration': 'none',
      'cursor': 'pointer',
      'font-size': '3em',
      'color': '#96766D'
    },
    topicName: {
      'cursor': 'pointer',
      'font-size': '3em',
      'color': '#489668'
    },
    content: {
      'font-size': '2em'
    },
    subTopicName: {
      'cursor': 'pointer'
    },
    subTopicContent: {

    }
  },
  stylesheet: function () {
    this._stylesheet || (this._stylesheet = jss.createStyleSheet(this.styles).attach())
    return this._stylesheet
  }







}

















function newContentView(route, topic) {
  return m('newContent', [
    m('form', {
      onsubmit: function(e) {
        e.preventDefault()
        Synergy.model.addContent(e.target[0].value, route, topic)
        e.currentTarget[0].value = ''
        //e.currentTarget[0].focus()
      }
    }, [
      m('input', {placeholder: 'Post Something Helpful', key: route + topic + 'newContent'})
    ])
  ])
}

function newTopicView(route) {
  return m('newTopic', [
    m('form', {
      onsubmit: function(e) {
        e.preventDefault()
        Synergy.model.addTopic(e.target[0].value, route)
        e.currentTarget[0].value = ''
      }
    }, [
      m('input', {placeholder: 'Start A New Topic'})
    ])
  ])
}

function parseRoute(route) {
  var variant = ''
  return route === '/' ?
    []
  : (function(){
      var paths = route.split('/')
      var step = Math.floor(100 / (paths.length - 1))
      var color1 = {r:215, g:38, b:114}
      var color2 = {r:166, g:226, b:46}
      var percent = 0
      var getColor = function() {
        var newColor = makeGradientColor(color1, color2, percent).cssColor
        percent += step
        return newColor
      }
      return paths.map(function(route, dex) {
        if(!dex){
          variant += '/'
          return {name: Synergy, route: variant, style: {color: getColor()}}
        } else {
          variant +=  variant === '/'?
            route
          : '/' + route
          return {name: route, route: variant, style: {color: getColor()}}
        }
      })
    })()
}

function testForLink(text) {
  return text.match(Synergy.model.urlRegex) ?
    (function() {
      if(!text.match('^http?:\/\/')) text = 'http://' + text
      return m('a', {href: text, style: {'font-size': '1em', cursor: 'pointer', color: '#80CC90'}}, text)
    })()
  : text
}


function makeGradientColor(color1, color2, percent) {
  var newColor = {};
  function makeChannel(a, b) {
    return(a + Math.round((b-a)*(percent/100)))
  }

  function makeColorPiece(num) {
    num = Math.min(num, 255)
    num = Math.max(num, 0)
    var str = num.toString(16)
    if (str.length < 2) {
        str = "0" + str
    }
    return(str)
  }

  newColor.r = makeChannel(color1.r, color2.r)
  newColor.g = makeChannel(color1.g, color2.g)
  newColor.b = makeChannel(color1.b, color2.b)
  newColor.cssColor = "#" + 
    makeColorPiece(newColor.r) + 
    makeColorPiece(newColor.g) + 
    makeColorPiece(newColor.b)
  return(newColor);
}