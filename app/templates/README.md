#  <%= slugname %> [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-url]][daviddm-image]

> convert markdown to html using [html-md](https://www.npmjs.com/package/html-md)

*Issues with the output should be reported on the html-md [issue tracker](https://github.com/neocotic/html.md/issues)*


## Install

```sh
$ npm install --save-dev broccoli-html
```


## Usage

```js
var broccoliHtml = require('broccoli-html');

tree = broccoliHtml(tree);
```

## API

### broccoliHtml(tree)

## Run Test
```sh
npm test
```

## Contribute or Report Issue
For bugs and feature requests, [please create an issue][issue-url].


## License

MIT © [Yashprit](yashprit.github.io)

[issue-url]: https://github.com/<%= props.githubUsername %>/<%= slugname %>/issues
[npm-url]: https://npmjs.org/package/<%= slugname %>
[npm-image]: https://badge.fury.io/js/<%= slugname %>.svg
[travis-url]: https://travis-ci.org/<%= props.githubUsername %>/<%= slugname %>
[travis-image]: https://travis-ci.org/<%= props.githubUsername %>/<%= slugname %>.svg?branch=master
[daviddm-url]: https://david-dm.org/<%= props.githubUsername %>/<%= slugname %>.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/<%= props.githubUsername %>/<%= slugname %>
