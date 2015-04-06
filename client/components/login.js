Login = {
  controller: function(options) {
    this.css = Login.stylesheet().classes
  }
  , view: function(ctrl) {
    var attr = {
      container: {
        class: ctrl.css.container
      }
      , header: {
        class: ctrl.css.header
      }
      , username: {
        class: ctrl.css.username
      }
      , password: {
        class: ctrl.css.password
      }
      , login: {
        class: ctrl.css.login
        , onmousedown: function(e) {
          e.target.style['background-color'] = '#559E3D'
        }
        , onmouseup: function(e) {
          e.target.style['background-color'] = '#0278AA'
        }
        , onmouseleave: function(e) {
          e.target.style['background-color'] = '#0278AA'
        }
      }
    }

    return m('div', attr.container, [
      m('h3', attr.header, 'Login')
      , m('input', attr.username)
      , m('br')
      , m('input', attr.password)
      , m('br')
      , m('button', attr.login, 'Submit')
    ])
  }
  , styles: {
    container: {
      'width': '25%'
      , 'position': 'relative'
      , 'height': '25%'
      , 'padding': '20px'
      , 'margin': '0px auto 0px auto'
      , 'background-color': '#272822'
      , 'text-align': 'center'
    }
    , header: {
      'color': '#FFFFFF'
    }
    , username: {
      'width': '100%'
      , 'padding': '0px 0px 0px 5px'
      , 'margin': '0px 0px 20px 0px'
      , 'background-color': '#474747'
      , 'color': 'white'
    }
    , password: {
      'width': '100%'
      , 'padding': '0px 0px 0px 5px'
      , 'margin': '0px 0px 20px 0px'
      , 'background-color': '#474747'
      , 'color': 'white'
    }
    , login: {
      'background-color': '#0278AA'
      , 'margin': '0px 0px 30px 0px'
      , 'color': '#FFFFFF'
    }
  }

  , stylesheet: function () {
    this._stylesheet || (this._stylesheet = jss.createStyleSheet(this.styles).attach())
    return this._stylesheet
  }


  
}


