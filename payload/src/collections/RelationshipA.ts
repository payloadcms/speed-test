import { CollectionConfig } from "payload/types";

export const RelationshipA: CollectionConfig = {
  slug: 'relationship-a',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'relation',
      type: 'relationship',
      relationTo: 'relationship-b',
      required: true,
    }
  ]
}