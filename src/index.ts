import * as dgram from 'dgram'
import * as xml2js from 'xml2js'

function xmlEncode(str: string) {
  return str.replace(/[<>&'"]/g, (c: string) => {
    switch (c) {
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '&': return '&amp;'
      case '\'': return '&apos;'
      case '"': return '&quot;'
      default: return c
    }
  })
}

// Check from das.domain.fi:715 (UDP) if domain is available
export async function dasQueryDomainAvailable(domain: string): Promise<boolean> {
  const dasServer = 'das.domain.fi'
  const dasPort = 715
  const query = '<?xml version="1.0" encoding="UTF-8"?>' +
    '<iris1:request xmlns:iris1="urn:ietf:params:xml:ns:iris1">' +
    '<iris1:searchSet>' +
    '<iris1:lookupEntity registryType="dchk1" entityClass="domain-name" entityName="' + xmlEncode(domain) + '"/>' +
    '</iris1:searchSet>' +
    '</iris1:request>'
  const response = (await new Promise((resolve, reject) => {
    const socket = dgram.createSocket('udp4')
    socket.on('error', err => {
      reject(err)
      socket.close()
    })
    socket.on('message', (msg, _rinfo) => {
      const response = msg.toString()
      xml2js.parseString(response, (err, doc) => {
        if (err) reject(err)
        else resolve(doc)
      })
      socket.close()
    })
    socket.on('close', () => {
    })
    socket.on('listening', () => {
      socket.send(query, dasPort, dasServer)
    })
    socket.bind()
  })) as any
  const status = response && response.domain && response.domain.status
  if (status[0] && status[0].active) {
    // Taken
    return false
  } else if (status[0] && status[0].available) {
    // Available
    return true
  } else if (status[0] && status[0].invalid) {
    // Invalid request
    throw new Error('Invalid DAS request')
  }
  // Invalid response
  throw new Error('Invalid DAS response')
}
