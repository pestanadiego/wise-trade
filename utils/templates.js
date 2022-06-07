const offerTemplate = (email) => {
  const template = {
    title: 'You have an offer on your listing',
    email,
    notes: 'Lorem ipsum',
  };
  return template;
};

export default offerTemplate;
