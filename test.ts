import { Directus } from '@directus/sdk'
import fs from 'fs'
import path from 'path'

require('isomorphic-fetch')

const getAverage = arr => arr.reduce((p, c) => p + c, 0) / arr.length

const [platform] = process.argv.slice(2)
const query = fs.readFileSync(path.resolve(__dirname, platform, 'query.graphql'), 'utf8')

const main = async () => {
  let authHeader
  let performQuery
  if (platform === 'payload') {
    authHeader = await getPayloadAuthHeader()
    performQuery = async () => await performPayloadQuery(authHeader, query)
  } else if (platform === 'directus') {
    authHeader = await getDirectusAuthHeader()
    performQuery = async () => await performDirectusQuery(authHeader, query)
  } else if (platform === 'strapi') {
    authHeader = await getStrapiAuthHeader()
    performQuery = async () => await performStrapiQuery(authHeader, query)
  } else {
    throw new Error(`Unknown platform: ${platform}`)
  }

  const startTime = new Date().getTime()
  const fetchTimes: number[] = []

  await [...Array(100)].reduce(async (priorFetch, _, i) => {
    await priorFetch
    const sendDate = new Date().getTime()

    await performQuery()
    const receiveDate = new Date().getTime()
    const completionTime = receiveDate - sendDate

    console.log(`Request ${i + 1} completed in ${completionTime}ms`)
    fetchTimes.push(completionTime)
  }, Promise.resolve())

  const endTime = new Date().getTime()
  const totalTestTime = endTime - startTime

  const average = getAverage(fetchTimes)
  const max = Math.max(...fetchTimes)
  const min = Math.min(...fetchTimes)

  console.log(`Performance test completed in ${totalTestTime}ms`)
  console.log(`Average response time: ${average}ms`)
  console.log(`Max response time: ${max}ms`)
  console.log(`Min response time: ${min}ms`)

  fs.writeFileSync(
    `results-${platform}.json`,
    JSON.stringify({ average, max, min, totalTestTime }),
    'utf8',
  )
}

main()

// Auth
async function getPayloadAuthHeader() {
  const res = await fetch('http://localhost:3000/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'dev@payloadcms.com',
      password: 'test',
    }),
  })
  const { token } = await res.json()
  return `JWT ${token}`
}

async function getDirectusAuthHeader() {
  const directus = new Directus('http://localhost:8055/', {
    auth: {
      mode: 'cookie',
    },
  })

  await directus.auth
    .login({
      email: 'dev@payloadcms.com',
      password: 'test',
    })
    .catch(() => {
      console.error('Invalid credentials')
    })

  const token = await directus.auth.token
  return `Bearer ${token}`
}

async function getStrapiAuthHeader() {
  const res = await fetch('http://localhost:1337/api/auth/local', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      identifier: 'user@user.com',
      password: 'Test123123',
    }),
  })
  const { jwt } = await res.json()
  return `Bearer ${jwt}`
}

// Queries
async function performPayloadQuery(authHeader: string, query: string) {
  await fetch('http://localhost:3000/api/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader,
    },
    body: JSON.stringify({
      query,
    }),
  })
}

async function performDirectusQuery(authHeader: string, query: string) {
  await fetch('http://localhost:8055/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader,
    },
    body: JSON.stringify({
      query,
    }),
  })
}

async function performStrapiQuery(authHeader: string, query: string) {
  await fetch('http://localhost:1337/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader,
    },
    body: JSON.stringify({
      query,
    }),
  })
}
