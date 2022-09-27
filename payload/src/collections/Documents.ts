import { CollectionConfig } from "payload/types";

export const Documents: CollectionConfig = {
  slug: 'documents',
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
      name: 'group',
      type: 'group',
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
        {
          name: 'nestedGroup',
          type: 'group',
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
            }
          ]
        }
      ]
    },
    {
      name: 'array',
      type: 'array',
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
        {
          name: 'nestedArray',
          type: 'array',
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
            },
            {
              name: 'relation',
              type: 'relationship',
              required: true,
              relationTo: 'relationship-a',
            }
          ]
        }
      ]
    },
    {
      name: 'blocks',
      type: 'blocks',
      blocks: [
        {
          slug: 'relationToOne',
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
            },
            {
              name: 'relation',
              type: 'relationship',
              required: true,
              relationTo: 'relationship-a',
            }
          ]
        },
        {
          slug: 'hasManyRelations',
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
            },
            {
              name: 'relationToMany',
              type: 'relationship',
              required: true,
              relationTo: 'relationship-a',
              hasMany: true,
            }
          ]
        }
      ]
    },
    {
      name: 'relation',
      type: 'relationship',
      required: true,
      hasMany: true,
      relationTo: 'relationship-a',
    }
  ]
}