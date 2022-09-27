#!/usr/bin/env ts-node -T
import 'isomorphic-fetch'
import { v4 as uuid } from 'uuid'

const recordCount = 30

const baseUrl = 'http://localhost:1337'
const apiUrl = `${baseUrl}/api`

const headers = {
  'Content-Type': 'application/json',
}

async function main() {
  // TODO: drop and recreate DB

  const res = await fetch(`${apiUrl}/auth/local/register`, {
    body: JSON.stringify({
      username: 'User',
      email: 'user@user.com',
      password: 'Test123123',
    }),
    headers,
    method: 'post',
  })
  if (res.status !== 200) throw Error('Unable to register user.')
  const { jwt: token } = await res.json()

  const relationshipAIDs: number[] = []
  const relationshipBIDs: number[] = []

  console.log({ token })
  ;[...Array(recordCount)].map(async (_, i) => {
    const id = i + 1
    relationshipBIDs.push(id)
    await create(
      'relationship-bs',
      {
        title: uuid(),
      },
      token,
    )
  })
  ;[...Array(recordCount)].map((_, i) => {
    const id = i + 1
    relationshipAIDs.push(id)
    create(
      'relationship-as',
      {
        title: uuid(),
        relationship_b: relationshipBIDs[Math.floor(Math.random() * relationshipBIDs.length)],
      },
      token,
    )
  })

  const arrayData = Array.from(Array(10).keys()).map(() => ({
    text: uuid(),
    NestedArray: Array.from(Array(10).keys()).map(() => {
      const randomRelationshipAID =
        relationshipAIDs[Math.floor(Math.random() * relationshipAIDs.length)]

      return {
        text: uuid(),
        relationship_a: randomRelationshipAID,
      }
    }),
  }))

  const blockData: any[] = []

  for (let i = 0; i <= 10; i++) {
    const randomRelationshipAID =
      relationshipAIDs[Math.floor(Math.random() * relationshipAIDs.length)]

    blockData.push({
      __component: 'document.relation-to-one',
      text: uuid(),
      relation: randomRelationshipAID,
    })
  }

  for (let i = 0; i <= 10; i++) {
    blockData.push({
      __component: 'document.has-many-relations',
      text: uuid(),
      relationToMany: Array.from(Array(3).keys()).map(() => {
        return relationshipAIDs[Math.floor(Math.random() * relationshipAIDs.length)]
      }),
    })
  }

  create(
    'documents',
    {
      title: 'Document1',
      Group: {
        text: uuid(),
        NestedGroup: {
          text: uuid(),
        },
      },
      array: arrayData,
      blocks: blockData,
      relationship_as: relationshipAIDs,
    },
    token,
  )
}

main()

type Entity = 'documents' | 'relationship-as' | 'relationship-bs'
async function create(entity: Entity, body: any, token: string) {
  const req = {
    body: JSON.stringify({ data: body }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    method: 'post',
  }
  const res = await fetch(`${apiUrl}/${entity}`, req)
  const json = await res.json()
  if (res.status !== 200) {
    console.log({ status: res.status, entity, json })
  } else {
    console.log({ status: res.status, entity, id: body.id })
  }
}
