const offerTemplate = (email) => {
  const template = {
    title: 'You have an offer on your listing',
    email,
    notes: 'Lorem ipsum',
  };
  return template;
};

const offerAcceptedTemplate = (email) => {
  const template = {
    title: 'Your offer has been accepted',
    email,
    notes: 'Lorem ipsum',
  };
  return template;
};

export default { offerTemplate, offerAcceptedTemplate };
