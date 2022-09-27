import { Payload } from "payload";
import { v4 as uuid } from 'uuid';
import { mapAsync } from './utilities/mapAsync';

export const seed = async (payload: Payload): Promise<void> => {

  // Create initial user

  await payload.create({
    collection: 'users',
    data: {
      email: 'dev@payloadcms.com',
      password: 'test',
    }
  })

  const relationshipAIDs = [];
  const relationshipBIDs = [];

  // Create 30 relationship-b docs

  await mapAsync([...Array(30)], async () => {
    const doc = await payload.create({
      collection: 'relationship-b',
      data: {
        title: uuid(),
      },
    });

    payload.logger.info(`Relationship B created with ID ${doc.id}`)
    relationshipBIDs.push(doc.id);
  });

  // Create 30 relationship-a docs

  await mapAsync([...Array(30)], async () => {
    const randomRelationshipBID = relationshipBIDs[Math.floor(Math.random() * relationshipBIDs.length)];

    const doc = await payload.create({
      collection: 'relationship-a',
      data: {
        title: uuid(),
        relation: randomRelationshipBID
      },
    });

    payload.logger.info(`Relationship A created with ID ${doc.id}`)
    relationshipAIDs.push(doc.id);
  });

  // Create an array with 10 rows, each having 10 nested rows

  const arrayData = Array.from(Array(10).keys()).map(() => ({
    text: uuid(),
    nestedArray: Array.from(Array(10).keys()).map(() => {
      const randomRelationshipAID = relationshipAIDs[Math.floor(Math.random() * relationshipAIDs.length)]

      return {
        text: uuid(),
        relation: randomRelationshipAID
      }
    }),
  }))

  // Create 20 blocks, 10 of 'relations' and 10 of 'hasManyRelations'

  const blockData = [];

  for (let i = 0; i <= 10; i++) {
    const randomRelationshipAID = relationshipAIDs[Math.floor(Math.random() * relationshipAIDs.length)]

    blockData.push({
      blockType: 'relationToOne',
      text: uuid(),
      relation: randomRelationshipAID,
    })
  }

  for (let i = 0; i <= 10; i++) {
    blockData.push({
      blockType: 'hasManyRelations',
      text: uuid(),
      relationToMany: Array.from(Array(3).keys()).map(() => {
        return relationshipAIDs[Math.floor(Math.random() * relationshipAIDs.length)]
      }),
    })
  }

  // Create doc for performance testing

  const doc = await payload.create({
    collection: 'documents',
    data: {
      title: uuid(),
      group: {
        text: uuid(),
        nestedGroup: {
          text: uuid(),
        }
      },
      array: arrayData,
      blocks: blockData,
      relation: relationshipAIDs
    }
  })

  payload.logger.info(`Performance testing document created with ID ${doc.id}`)
}