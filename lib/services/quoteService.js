const fetch = require('cross-fetch');

module.exports = class quoteService {
  static async getQuotes() {
    const array = [
      'https://programming-quotes-api.herokuapp.com/quotes/random',
      'https://quotes.rest/qod?language=en',
      'http://api.quotable.io/random',
    ];

    const promiseArr = array.map((api) => {
      return fetch(api);
    });

    const quoteArr = await Promise.all(promiseArr).then((response) => {
      return Promise.all(response.map((item) => item.json()));
    });

    const setArr = quoteArr.map((item) => {
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
    });
    return setArr;
  }
};
