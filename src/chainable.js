import elements from './elements.js'

const chainable = function (options) {
  let prettify = false
  if (options && options.prettify) {
    prettify = true
  }
  const prototype = {
    chain: [],
    prettify,
    toString: function () {
      const chain = this.chain
      this.chain = []
      return chain.reverse().reduce((acc, [func, children, options]) => {
        if (typeof children == 'string') {
          children = [children]
        }

        if (children && !Array.isArray(children)) {
          options = children
          children = undefined
        }

        if (children) {
          return func([...acc, ...children], {
            ...options,
            prettify: this.prettify,
          })
        }

        return func(acc, { ...options, prettify: this.prettify })
      }, '')
    },
  }

  Object.keys(elements).forEach(k => {
    prototype[k] = function (children, options) {
      if (typeof children == 'string') {
        children = [children]
      }

      if (children && !Array.isArray(children)) {
        options = children
        children = undefined
      }

      this.chain.push([elements[k], children, options])
      return this
    }
  })

  return prototype
}

export default chainable
