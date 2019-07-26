# WebCat .fi Domain Availability Service Client

Copyright (C) WebCat & Clouden Oy 2019, author Kenneth Falck <kennu@clouden.net>

## Overview

This is a simple Node.js / TypeScript client library for checking whether  a domain is available in the .fi domain registry.

We use this library in the https://webcat.fi domain registrar service to check for available domains.

You can find more information about the DAS service at https://www.traficom.fi/en/communications/fi-domains/domain-name-registrars.

## Installation

    npm install webcat-das-fi-client

## Usage

```typescript
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
```
