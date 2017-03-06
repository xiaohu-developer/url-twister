const test = require('tape');
const urlTwister = require('..');
const path = require('path');

const opt = {
  prepend: '/addd/good',
  prependRelative: 'test',
  append: '?@MD5',
  root: 'test'
};

test('md5 generate correct for relative url', function (t) {
  const result = urlTwister('./absolute.jpg', path.resolve(__dirname, './test'), opt);
  t.equal(result, 'test/absolute.jpg?ede58c469aa95eb42c5148fa0afd9844', 'twister relative url correct');
  t.end();
});

test('md5 generate correct for absolute url', function (t) {
  const result = urlTwister('/absolute.jpg', path.resolve(__dirname, './test'), opt);
  t.equal(result, '/addd/good/absolute.jpg?ede58c469aa95eb42c5148fa0afd9844', 'twister absolute url correct');
  t.end();
});

test('none exist url', function (t) {
  const result = urlTwister('/absolute1.jpg', path.resolve(__dirname, './test'), opt);
  t.equal(result, '/addd/good/absolute1.jpg', 'url twister none exist url correct');
  t.end();
});

test('full urls should not be changed', function (t) {
  const rHTTP = urlTwister('http://foo/absolute.jpg', path.resolve(__dirname, './test'), opt);
  const rHTTPs = urlTwister('https://foo/absolute.jpg', path.resolve(__dirname, './test'), opt);
  const rData = urlTwister('data:image/jpg;base64,/9j/ke4uvs', path.resolve(__dirname, './test'), opt);

  t.equal(rHTTP, 'http://foo/absolute.jpg', 'twister correct for http full url');
  t.equal(rHTTPs, 'https://foo/absolute.jpg', 'twister correct for https full url');
  t.equal(rData, 'data:image/jpg;base64,/9j/ke4uvs', 'twister correct for data full url');
  t.end();
});
