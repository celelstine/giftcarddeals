'use strict';

module.exports = {
  genereateOrderNumber: function genereateOrderNumber() {
    var now = Date.now().toString(); // '1492341545873'
    // pad with extra random digit
    now += Math.floor(Math.random() * 100).toString();
    // format the string
    return [now.slice(0, 5), now.slice(5, 10), now.slice(10, 15)].join('-');
  }
};