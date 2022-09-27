import { buildConfig } from 'payload/config';
import path from 'path';
import Users from './collections/Users';
import { Documents } from './collections/Documents';
import { RelationshipA } from './collections/RelationshipA';
import { RelationshipB } from './collections/RelationshipB';
import { seed } from './seed';

export default buildConfig({
  serverURL: 'http://localhost:3000',
  admin: {
    user: Users.slug,
  },
  collections: [
    Documents,
    RelationshipA,
    RelationshipB,
    Users,
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  onInit: async (payload) => {
    await seed(payload);
  }
});
