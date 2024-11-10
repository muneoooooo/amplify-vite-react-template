import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';


const backend = defineBackend({
  auth,
  data
});

backend.data.resources.cfnResources.cfnGraphqlApi.addPropertyOverride('Tags', [
  {
    Key: 'graphqlapi-tag-1',
    Value: 'graphql-tag-value-1'
  },
  {
    Key: 'graphqlapi-tag-2',
    Value: 'graphql-tag-value-2'
  },
  {
    Key: 'auto-delete',
    Value: 'no'
  }
]);