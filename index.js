var path = require('path');
var md5File = require('md5-file');
var __root = require('app-root-dir').get();
var urlParser = require('url');

function partition (tag) {
  var ret = typeof tag === 'string' && tag.match(/^\?@(MD5)(?:&(.*))?$/);
  ret = ret ? {type: 'MD5', fallback: ret[2] || ''} : {type: 'OTHER', fallback: tag};
  return ret;
}

module.exports = function urlTwister (url, curFilePath, options) {
  var prepend = options.prepend;
  var replace = options.replace;
  var root = options.root
  ? path.join(__root, options.root)
  : __root;
  var prependRelative = options.prependRelative;
  var append = partition(options.append);

  if (url.match(/^(?:data:|http:|https:|ftp:)/)) {
    return url;
  } else {
    var urlPieces = urlParser.parse(url);
    var newUrl = urlPieces.pathname;
    // prepend
    if (prepend && url.charAt(0) === '/') { // absolute path
      newUrl = path.join(prepend, newUrl);
    } else if (prependRelative) {
      newUrl = path.join(prependRelative, newUrl);
    }
    // add tag
    var dir = curFilePath ? path.dirname(curFilePath) : __root;
    var tag = append.fallback;
    if (append.type === 'MD5') {
      var filePath = url.charAt(0) === '/'
      ? path.join(root, urlPieces.pathname)
      : path.resolve(dir, urlPieces.pathname);
      try {
        tag = md5File.sync(filePath);
      } catch (e) {}
    }
    if (tag) {
      if (typeof tag === 'function') {
        newUrl = tag(url);
      } else {
        tag = tag.replace(/^\?+/, '');
        var search = urlPieces.search
        ? urlPieces.search + '&' + tag
        : '?' + tag;
        var hashtag = urlPieces.hash || '';
        newUrl += search + hashtag;
      }
    }
    // replace url
    if (replace) {
      if (typeof replace === 'function') {
        newUrl = replace(url);
      } else {
        newUrl = newUrl.replace(replace[0], replace[1]);
      }
    }
    return newUrl.replace('//', '/');
  }
};
