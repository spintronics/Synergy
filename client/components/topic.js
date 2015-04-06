headTopics = {
  controller: reactive(function() {
    ctrl = this
    ctrl.css = headTopics.stylesheet().classes
    ctrl.topics = model.getTopics()
    ctrl.showing = {}
    // for(var x = 0; x < this.topics.length; x++) {
    //   this.showing[this.topics[x].name] = true
    // }
    ctrl.toggleTopic = function(topicName) {
      if(ctrl.showing[topicName]) {
        delete ctrl.showing[topicName]
      } else ctrl.showing[topicName] = true
    }
    return ctrl
    // m.route.param('itemPath')
  }),
  view: function(ctrl) {
    var attr = {
      container: {
        class: ctrl.css.container
      },
      topicContainer: {
        class: ctrl.css.topicContainer
      },
      topic: {
        class: ctrl.css.topic,
        onclick: function(e) {

        }
      },
      // topicName: {
      //   class: ctrl.css.topicName,
      //   onclick: function(e) {
      //     ctrl.toggleTopic(e.target.textContent)
      //   }
      // },
      topicContent: {

      },
      newTopic: {
        input: {
          placeholder: 'New Topic'
        },
        onsubmit: function(e) {
          e.preventDefault()
          model.addTopic(e.target[0].value)
          e.target[0].value = ''
        }
      }
    }
    return m('div', attr.container, [

      m('div.topicContainer', attr.topicContainer, ctrl.topics.map(function(topic) {
        return m('div.topic', attr.topic, [
          m('span.topicName', {
            class: ctrl.css.topicName,
            onclick: ctrl.toggleTopic.bind(null, topic.name),
            path: topic.name
          }, topic.name),
          m('div.topicContent', attr.topicContent, renderTopic(topic, ctrl))
        ])
      })),
      m('form.newTopc', attr.newTopc, [
        m('input.topicInput', attr.newTopic.input)
      ])
    ])
  },
  styles: {
    container: {
    },
    topicContainer: {
    },
    topic: {
    },
    topicName: {
      'cursor': 'pointer',
      'border': '2px solid #E1C96F',
      'font-size': '3em'
    },
    topicContent: {
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

function renderTopic(topic, ctrl) {
  var currentPath = ''


  attr = {
    // subTopicName: {
    //   class: ctrl.css.subTopicName,
    //   onclick: function(e) {
    //     ctrl.toggleTopic(e.target.textContent)
    //   }
    // },
    subTopicContent: {
      class: ctrl.css.subTopicContent
    },
    newContent: {
      onsubmit: function(e) {
        e.preventDefault()
        console.log(e)
        //model.addTopic(e.target[0].value)
        e.target[0].value = ''
      }
    },
    newContentInput: {
      placeholder: 'Add Content'
    }
  }



  currentPath += topic.name
  function loop(topic) {
    var innerContent = []
    if(ctrl.showing[topic.name]){
      topic.content.forEach(function(item) {
        if(typeof item === 'object' && !(item instanceof Array)){
          currentPath += '/' + item.name
          var subTopic = loop(item)
          innerContent.push(m('div.subTopic', [
            m('div.subTopicName', {
              onclick: ctrl.toggleTopic.bind(null, item.name),
              class: ctrl.css.subTopicName
            } , item.name),

            ctrl.showing[item.name] ?
              m('ul', [
                m('li', subTopic)
              ])
              : null
          ]))
        } else if(item instanceof Array){
          //account for tabs
        } else {
          innerContent.push(m('li', [
            m('span', item)
          ]))
        }
      })
      innerContent.push(
        m('form.newContent', {
          path: currentPath,
          onsubmit: function(e){
            e.preventDefault()
            model.addContent(e.target[0].value, e.target.attributes.path.value)
            e.target[0].value = ''
          }
        }, [
          m('input', attr.newContentInput)
        ])
      )
      currentPath = currentPath.split('/')
      currentPath = currentPath.slice(0, currentPath.length - 1).join('/')
    }
    return innerContent
  }
  var content = loop(topic)
  return content
}

