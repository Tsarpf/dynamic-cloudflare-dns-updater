const axios = require('axios')
const Promise = require('bluebird')
const conf = require('./settings/settings.json')
const ipv4 = require('public-ip').v4

const domain = process.env.TARGET_DOMAIN ? process.env.TARGET_DOMAIN
                                         : conf.domain

const updateInterval = process.env.UPDATE_INTERVAL_MS ? process.env.UPDATE_INTERVAL_MS
                                                      : conf.updateInterval

const getIpAddress = () => process.env.IP_ADDRESS ? Promise.resolve(process.env.IP_ADDRESS)
                                                  : conf.ipAddress ? Promise.resolve(conf.ipAddress)
                                                                   : ipv4()

const instance = axios.create({
  baseURL: 'https://api.cloudflare.com/client/v4',
  headers: {
    'X-Auth-Email': process.env.EMAIL ? process.env.EMAIL : conf.email,
    'X-Auth-Key': process.env.AUTH_KEY ? process.env.AUTH_KEY : conf.authKey,
    'Content-Type': 'application/json'
  }
})

function update() {
  console.log(`updating ${domain} records ${new Date()}`)
  let zoneId
  let ipAddress

  return getIpAddress().then(address => {
    ipAddress = address
    console.log(`using ip address ${ipAddress}`)
  })
  .then(_ => instance.get('/zones', {name: domain}))
  .then(e => {
    const zones = e.data.result.filter(z => z.name === domain)

    if (zones.length > 1) {
      console.log('warning! more than one zone found, only updating first one')
    } else if (zones.length === 0) {
      throw 'no zone found with given domain'
    }

    zoneId = zones[0].id
    return instance.get(`/zones/${zoneId}/dns_records`)
  })
  .then(e =>
        Promise.all(
          e.data.result
            .filter(item => item.type === 'A')
            .map(item => instance.put(`/zones/${zoneId}/dns_records/${item.id}`, {
              type: item.type,
              name: item.name,
              content: ipAddress
            })))
        )
  .then(() => console.log('done!'))
  .catch(e => console.log(`Error! ${e}`))
}

function updatePeriodic() {
  update().then(_ => console.log(`sleeping for ${updateInterval / 1000 / 60} minutes`))
	  .catch(e => console.log(`Error! ${e} ${new Date()}`))
}

// If no updateInterval set, just run once and exit
updateInterval ? updatePeriodic() || setInterval(updatePeriodic, parseInt(updateInterval))
               : update()
