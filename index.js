const axios = require('axios')
const Promise = require('bluebird')
const conf = require('./settings/settings.json')

const instance = axios.create({
  baseURL: 'https://api.cloudflare.com/client/v4',
  headers: {
    'X-Auth-Email': conf.email,
    'X-Auth-Key': conf.authKey,
    'Content-Type': 'application/json'
  }
})

if (conf.updateInterval) {
  update().then(_ => console.log(`sleeping for ${conf.updateInterval / 1000 / 60} minutes`))
  setInterval(() =>
              update().then(_ => console.log(`sleeping for ${conf.updateInterval / 1000 / 60} minutes`)),
              parseInt(conf.updateInterval))
} else {
  update()
}

function update() {
  console.log(`updating ${conf.domain} records ${new Date()}`)
  let zoneId
  let newAddress
  return (process.env.IP_ADDRESS ? Promise.resolve(process.env.IP_ADDRESS) : conf.ipAddress ? Promise.resolve(conf.ipAddress) : require('public-ip').v4())
    .then(address => {
      newAddress = address
      console.log(`using ip address ${newAddress}`)
    })
    .then(_ => instance.get('/zones', {name: conf.domain}))
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
    .then(e =>
          Promise.all(
            e.data.result
              .filter(item => item.type === 'A')
              .map(item => instance.put(`/zones/${zoneId}/dns_records/${item.id}`, {
                type: item.type,
                name: item.name,
                content: newAddress
              })))
         )
    .then(() => console.log('done!'))
    .catch(e => console.log(`Error! ${e} ${new Date()}`))
}
