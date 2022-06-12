const offerTemplate = (email, listingName, listingId) => {
  const template = {
    title: 'You have an offer on your listing',
    email,
    notes: `You receive an offer to your listing: ${listingName}`,
    wisetrade: `<a href="localhost:8080/myListing/${listingId}">your listing</a>`,
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
