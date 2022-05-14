import sanityClient from '@sanity/client';

const client = sanityClient({
  projectId: 'yo95xgxn',
  dataset: 'production',
  apiVersion: '2021-03-25',
  useCdn: false,
  token:
    'sklcVTFoUXzt1XqgCIvc5FiO1o6EuBTrlN5vQjESYcbW1MWm1KzvLDVZzcZf0dz1AIE0LPH0oaEK9VKswsBgC6LmqTLFSeTIsSHJfo0nOLrY1mgigWEbRKBj0NAwJudtod1vFLSjHlfrJ7Bkl3AxANDuvMykfcWjDZb9HN981aJnwHzBhrEd',
});

export default client;
