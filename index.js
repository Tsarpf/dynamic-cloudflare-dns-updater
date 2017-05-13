const axios = require('axios')
const Promise = require('bluebird')
const conf = require('./settings.json')

const instance = axios.create({
  baseURL: 'https://api.cloudflare.com/client/v4',
  headers: {
    'X-Auth-Email': conf.email,
    'X-Auth-Key': conf.authKey,
    'Content-Type': 'application/json'
  }
})

let zoneId
instance.get('/zones', {name: conf.domain})
  .then(e => {
    const result = e.data.result.filter(z => z.name === conf.domain)

    if (result.length > 1) {
      console.log('warning! more than one zone was found with the given domain, only updating first one')
    } else if (result.length === 0) {
      throw 'no zone found with given domain'
    }

    zoneId = result[0].id
    return instance.get(`/zones/${zoneId}/dns_records`)
  })
  .then((conf.newAddress ? Promise.resolve(conf.newAddress) : require('public-ip').v4())
  .then(e =>
        Promise.all(
          e.data.result
            .filter(item => item.type === 'A')
            .map(item => instance.put(`/zones/${zoneId}/dns_records/${item.id}`, {
              type: item.type,
              name: item.name,
              content: conf.newAddress
            })))
       )
  .then(() => {
    console.log('done!')
  })
  .catch(e => console.log(e))
