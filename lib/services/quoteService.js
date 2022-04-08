const fetch = require('cross-fetch');

module.exports = class quoteService {
  static getQuotes() {
    const apiArr = [
      'https://programming-quotes-api.herokuapp.com/quotes/random',
      'https://futuramaapi.herokuapp.com/api/quotes/1',
      'http://api.quotable.io/random',
    ];

    const promiseArr = apiArr.map((api) => {
      return fetch(api);
    });

    return Promise.all(promiseArr)
      .then((response) => {
        return Promise.all(response.map((item) => item.json()));
      })

      .then((array) =>
        array.map((item) => {
          if (item.success) {
            return {
              author: item.contents.quotes[0].author,
              content: item.contents.quote[0].quote,
            };
          } else if (item.author) {
            return {
              author: item.author,
              content: item.content || item.en,
            };
          } else {
            return {
              author: 'not available',
              content: 'not available',
            };
          }
        })
      );
  }
};
