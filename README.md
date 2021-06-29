# domguy

generate dom trees from js

## Install

`npm install domguy`

## Usage

```javascript
import { chainable, elements } from 'domguy'
import { writeFileSync } from 'fs'

const root = chainable({ prettify: true })
const { head, meta, title, body, div, h1 } = elements

const page = root
  .html(
    [
      head([
        meta({
          std: [['charset', 'UTF-8']],
        }),
        meta({
          std: [
            ['http-equiv', 'X-UA-Compatible'],
            ['content', 'IE=edge'],
          ],
        }),
        meta({
          std: [
            ['name', 'viewport'],
            ['content', 'width=device-width, initial-scale=1.0'],
          ],
        }),
        title('Document'),
      ]),
      body(
        [
          div(h1('Hello World!'), {
            std: [
              ['style', ['display:flex;', 'justify-content:space-between;']],
            ],
          }),
        ],
        {
          std: [['style', 'margin:128px;']],
        }
      ),
    ],
    {
      std: [['lang', 'en']],
      nstd: [['non-standard-attribute', 'value']],
    }
  )
  .toString()

writeFileSync('page.html', page, 'utf8')
```
