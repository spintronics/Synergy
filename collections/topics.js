Topics = new Meteor.Collection('topics')
Topics.remove({})
Topics.insert({
  name: 'Mithril',
  content: [
    {
      name: 'modules',
      content: [
        'require user and controller',
        {
          name: 'unloading',
          content: [
            'this.onunload',
            'Fly McQueen'
          ]
        },
        'Render Bender'
      ]
    },
    'Big Data'
  ]
})

