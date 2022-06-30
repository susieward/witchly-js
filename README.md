# witchly-js

Lightweight, hyper-flexible, web components-based front-end framework. Under active development.

https://npmjs.com/package/witchly

```
npm install witchly
```

### Feature highlights

- JSX support (see setup instructions below)
- Component definition flexibility (components can be objects, functions, classes)
- Intuitive reactivity system
- Single-page application routing


### In the works/upcoming:
- A CLI service for quickly setting up new projects
- Quickstart instructions
- In-depth documentation

### JSX Setup
**Note:** A cli npm package is in the works that will automate this setup for you, if desired.

However, in the meantime:

Step 1: Install dev dependencies
```
npm install --save-dev @babel/core @babel/cli @babel/preset-react
```
If you're using webpack, you'll also need to install `babel-loader` and make sure your webpack config is set up to handle js files via the loader.


Step 2: Configure babel
```
// package.json

{
  "babel": {
    "presets": [
      [
        "@babel/preset-react",
        {
          "runtime": "automatic",
          "importSource": "witchly"
        }
      ]
    ]
  }
}
```

That's it!
```
import Witchly from 'witchly'

const App = () => {
  const el = 'my-app'
  const message = 'I'm a component using JSX!'

  const template = () => {
    <div>
      <p>{message}</p>
    </div>
  }
  return { el, template }
}

new Witchly({
  render: () => App
})
```
