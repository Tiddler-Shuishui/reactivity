function observe(obj){
  for(const key in obj){
    const fnList = []
    let value = obj[key]
    Object.defineProperty(obj, key, {
      get: function(){
        if(window.__fn && !fnList.includes(__fn)){
          fnList.push(__fn)
        }
        return value
      },
      set: function(val){
        value = val
        fnList.map(fn => fn())
      }
    })
  }
}

function observe2(target){
  const map = new Map()
  const handler = {
    get:function(target, prop){
      if(prop in target){
        !map.has(prop) && map.set(prop,[])
        const cacheList = map.get(prop)
        if(window.__fn && !cacheList.includes(__fn)){
          console.log('here')
          cacheList.push(__fn)
        }
        return target[prop]
      }else{
        throw new Error(`Property '${prop} does not exist.'`)
      }
    },
    set: function(target,prop,value){
      target[prop] = value
      map.get(prop)?.map(fn=>fn())
    }
  }
  return new Proxy(target, handler)
}

function call(fn){
  window.__fn = fn
  window.__fn()
  window.__fn = null
}