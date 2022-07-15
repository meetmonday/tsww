const axios = require('axios').default;
const cheerio = require('cheerio')

function tiktokdownload(url) {
  return new Promise((resolve, reject) => {
    axios.get('https://ttdownloader.com/')
      .then((data) => {
        const $ = cheerio.load(data.data)
        axios.post('https://ttdownloader.com/query/', `url=${url}&token=${$('#token').attr('value')}`, {
          headers: {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            origin: 'https://ttdownloader.com',
            referer: 'https://ttdownloader.com/',
            cookie: data.headers['set-cookie'].join(''),
          }
        }
        ).then(({ data }) => {
          const $ = cheerio.load(data)
          const result = {
            nowm: $('#results-list > div:nth-child(2) > div.download > a')?.attr('href'),
            wm: $('#results-list > div:nth-child(3) > div.download > a')?.attr('href'),
            audio: $('#results-list > div:nth-child(4) > div.download > a').attr('href')
          }
          resolve(result);
        })
          .catch(e => {
            reject({ status: false, message: 'error fetch data', e: e.message })
          })
      })
      .catch(e => {
        reject({ status: false, message: 'error fetch data', e: e.message })
      })
  })
}

module.exports.tiktokdownload = tiktokdownload
