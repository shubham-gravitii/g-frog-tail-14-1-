import { createServerRunner } from '@aws-amplify/adapter-nextjs';
import config from './amplifyconfiguration';

export const { runWithAmplifyServerContext } = createServerRunner({
  config
});