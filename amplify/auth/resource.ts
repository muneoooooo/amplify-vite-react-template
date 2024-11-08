import { defineAuth } from '@aws-amplify/backend';
import { Tags } from 'aws-cdk-lib';
/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
});

