import sanityClient from '@sanity/client';

const client = sanityClient({
  projectId: `${process.env.NEXT_PUBLIC_PROJECT_ID}`,
  dataset: 'production',
  apiVersion: '2021-03-25',
  useCdn: false,
  token: `${process.env.NEXT_PUBLIC_TOKEN}`,
});

export default client;
