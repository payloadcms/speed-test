#!/usr/bin/env ts-node -T
import 'isomorphic-fetch'
import shelljs from 'shelljs'
import { Pool, Client } from 'pg'

require('dotenv').config('../.env')

async function main() {
  const client = new Client()
  await client.connect()
  // const res = await client.query('DROP DATABASE strapi;')
  const res2 = await client.query('CREATE DATABASE asd;')
  await client.end()
}

main()
