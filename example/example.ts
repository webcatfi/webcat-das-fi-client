import { dasQueryDomainAvailable } from 'webcat-das-fi-client'

async function main() {
  try {
    const available: boolean = await dasQueryDomainAvailable('webcat.fi')
    console.log('Domain available:', available)
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

main()
