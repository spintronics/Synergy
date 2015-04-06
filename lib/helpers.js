


//////////////////////////////////////////
//                                      //
//           Polyfills                  //
//                                      //
//////////////////////////////////////////

if (!Object.assign) {
  Object.defineProperty(Object, 'assign', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function(target, firstSource) {
      'use strict';
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert first argument to object');
      }

      var to = Object(target);
      for (var i = 1; i < arguments.length; i++) {
        var nextSource = arguments[i];
        if (nextSource === undefined || nextSource === null) {
          continue;
        }

        var keysArray = Object.keys(Object(nextSource));
        for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
          var nextKey = keysArray[nextIndex];
          var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
          if (desc !== undefined && desc.enumerable) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
      return to;
    }
  });
}


//////////////////////////////////////////







//////////////////////////////////////////
//                                      //
//              Mithril                 //
//                                      //
//////////////////////////////////////////

reactive = function(controller) {
  return function() {
    var instance = {}
    var computation = Deps.autorun(function() {
      m.startComputation()
      controller.call(instance)
      m.endComputation()
    })

    instance.onunload = function() {
      computation.stop()
    }
    return instance
  }
}


//////////////////////////////////////////

M = {}

M.component = function () {
  var component = function (props, content) {
    return m.module(component, props, content)
  }
  return component
}


//Widget = M.component()

// Example use:
 
// m.module(document.body, {
//   view: function () {
//     return m('.app', [
//       m('h1', "Welcome!"),
//       Widget({ id: m.route.param('id') }) // <----- (!)
//       m.module(Widget, { id: m.route.param('id') }) // <----- (!)
//     ])
//   }
// })



//////////////////////////////////////////
//                                      //
//        Function Prototypes           //
//                                      //
//////////////////////////////////////////



Function.prototype.obind = function (ctx, obj) {
  var f = this
  var args = arguments
  return function () {
    arguments[0] = Object.assign(obj, arguments[0])
    return f.apply(ctx, arguments)
  }
}
 
// Example use:
// var add = function (params) {
//   return params.x + params.y
// }
// var add10 = add.obind({ x: 10 })
// add10({ y: 20 }) //=> 30
 


//////////////////////////////////////////
//                                      //
//          Component Helpers           //
//                                      //
//////////////////////////////////////////










//////////////////////////////////////////
//                                      //
//          Object Prototypes           //
//                                      //
//////////////////////////////////////////

_ = {}
_.clone = function(obj) {
  if (null == obj || "object" != typeof obj || obj instanceof Array) return obj;
  var copy = obj.constructor();
  for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
}
_.extend = function(base) {
  if(typeof base !== 'object' || base instanceof Array) return base
  var args = Array.prototype.slice.call(arguments)
  var obj = Object.create(base)
  for(var x = 1; x < args.length; x++){
    if(typeof args[x] === 'object' && !(args[x] instanceof Array)) {
      for (var i in args[x]) {
        if (args[x].hasOwnProperty(i) && !base.hasOwnProperty(i)) {
           base[i] = args[x][i];
        }
      }      
    }
  }
  return base
}