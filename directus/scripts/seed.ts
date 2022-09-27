import { Directus } from '@directus/sdk'
import { v4 as uuid } from 'uuid'
import { mapAsync } from './../utilities/mapAsync'
import login from './login'

const directus = new Directus('http://localhost:8055/', {
  auth: {
    mode: 'cookie',
  }
})

const seed = async (): Promise<void> => {
  await login(directus);

  const relationshipAIDs = []
  const relationshipBIDs = []
  const nestedArrayIDs = [];
  const arrayIDs = [];
  const hasManyRelationsIDs = [];
  const relationToOneIDs = [];

  // Create 30 relationship-b docs

  await mapAsync([...Array(30)], async () => {
    // const doc = await directus.collections.createOne({ collection: 'relationshipB', title: uuid() })
    const doc = await directus.items('relationshipB').createOne({
      text: uuid(),
    }) as { id: string }

    console.info(`Relationship B created with ID ${doc.id}`)
    relationshipBIDs.push(doc.id)
  })

  // Create 30 relationship-a docs

  await mapAsync([...Array(30)], async () => {
    const randomRelationshipBID = relationshipBIDs[Math.floor(Math.random() * relationshipBIDs.length)]

    const doc = await directus.items('relationshipA').createOne({
      title: uuid(),
      relation: randomRelationshipBID,
    }) as { id: string }

    console.info(`Relationship B created with ID ${doc.id}`)
    relationshipAIDs.push(doc.id)
  })

  // Create an array with 10 rows, each having 10 nested rows

  await mapAsync([...Array(10)], async () => {
    const randomRelationshipAID = relationshipAIDs[Math.floor(Math.random() * relationshipAIDs.length)]
    const result = await directus.items('nested_arrays').createOne({
      text: uuid(),
      relation: randomRelationshipAID,
    }) as { id: string }

    nestedArrayIDs.push(result.id);
  });

  await mapAsync([...Array(10)], async () => {
    const { id } = await directus.items('arrays').createOne({
      text: uuid(),
      nestedArrays: {
        create: nestedArrayIDs.map((id) => ({
          arrays_id: '+',
          nested_arrays_id: { id },
        })),
      },
    }) as { id: string }

    arrayIDs.push(id);
  })

  await mapAsync([...Array(10)], async () => {
    const randomRelationshipAID = relationshipAIDs[Math.floor(Math.random() * relationshipAIDs.length)]

    const { id } = await directus.items('hasManyRelations').createOne({
      text: uuid(),
      relationToMany: [{ collection: 'relationshipA', item: { id: randomRelationshipAID } }],
    }) as { id: string }

    hasManyRelationsIDs.push(id);
  })

  await mapAsync([...Array(10)], async () => {
    const randomRelationshipAID = relationshipAIDs[Math.floor(Math.random() * relationshipAIDs.length)]

    const { id } = await directus.items('relationToOne').createOne({
      text: uuid(),
      relation: randomRelationshipAID,
    }) as { id: string }
    relationToOneIDs.push(id);
  })

  const nestedGroupID = (await directus.items('nestedGroups').createOne({
    text: uuid(),
  }) as { id: string }).id

  const groupID = (await directus.items('groups').createOne({
    text: uuid(),
    nestedGroups: nestedGroupID,
  }) as { id: string }).id

  // Create doc for performance testing

  const doc = await directus.items('documents').createOne({
      title: uuid(),
      group: groupID,
      array: {
        create: arrayIDs.map((id) => ({
          documents_id: '+',
          arrays_id: { id },
        })),
      },
      relation: {
        create: relationshipAIDs.map((id) => ({
          documents_id: '+',
          relationshipA_id: { id },
        })),
      },
      blocks: [
        ...relationToOneIDs.map((id) => ({
          collection: 'relationToOne',
          item: id,
        })),
        ...hasManyRelationsIDs.map((id) => ({
          collection: 'hasManyRelations',
          item: id,
        })),
      ],
    }
  )

  console.info(`Performance testing document created with ID ${(doc as { id }).id}`)
}

seed()
