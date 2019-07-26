# WebCat .fi Domain Availability Service Client

Copyright (C) WebCat & Clouden Oy 2019, author Kenneth Falck <kennu@clouden.net>

## Overview

This is a simple Node.js / TypeScript client library for checking whether  a domain is available in the .fi domain registry.

## Installation

    npm install webcat-das-fi-client

## Usage

    import { dasQueryDomainAvailable } from 'webcat-das-fi-client'

    const available: boolean = await dasQueryDomainAvailable('webcat.fi')

