import d from 'd'
import { readFileSync } from 'fs'
import { dirname, resolve } from 'path'
import pretty from 'pretty'

const moduleURL = new URL(import.meta.url)
const __dirname = dirname(moduleURL.pathname)

const tags = JSON.parse(readFileSync(resolve(__dirname, 'tags.json'), 'utf8'))
const attributes = JSON.parse(
  readFileSync(resolve(__dirname, 'attributes.json'), 'utf8')
)
const empties = JSON.parse(
  readFileSync(resolve(__dirname, 'empties.json'), 'utf8')
)

const props = {}
tags.forEach(t => {
  props[t] = d('e', function (children, options) {
    if (typeof children == 'string') {
      children = [children]
    }

    if (children && !Array.isArray(children)) {
      options = children
      children = undefined
    }

    let str = `<${t}`

    if (options && options.std) {
      const spec = attributes[t] || []
      const globals = attributes['globals']

      options.std.forEach(k => {
        if (k.length == 1) {
          if (spec.includes(k[0]) || globals.includes(k[0])) {
            str += ` ${k[0]}`
            return
          }
        } else if (k.length == 2) {
          if (spec.includes(k[0]) || globals.includes(k[0])) {
            if (Array.isArray(k[1])) {
              str += ` ${k[0]}="${k[1].join(' ')}"`
            } else {
              str += ` ${k[0]}="${k[1]}"`
            }
            return
          }
        } else {
          throw Error(`attribute ${k[0]} has more than one value`)
        }

        throw Error(`attribute ${k[0]} is not documented for element ${t}`)
      })
    }

    if (options && options.nstd) {
      options.nstd.forEach(k => {
        if (k.length == 1) {
          str += ` ${k[0]}`
        } else if (k.length == 2) {
          if (Array.isArray(k[1])) {
            str += ` ${k[0]}="${k[1].join(' ')}"`
          } else {
            str += ` ${k[0]}="${k[1]}"`
          }
        } else {
          throw Error(`attribute ${k[0]} has more than one value`)
        }
      })
    }

    str += `>`

    if (children) {
      if (Array.isArray(children)) {
        str += children.join('')
      } else {
        str += children
      }
    }

    if (!empties.includes(t)) {
      str += `</${t}>`
    }

    if (options && options.prettify) {
      str = pretty(str)
    }

    return str
  })
})

const elements = {}
Object.defineProperties(elements, props)
export default elements
