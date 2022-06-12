const offerTemplate = (email, listingName, listingId) => {
  const template = {
    title: 'You have an offer on your listing',
    email,
    notes: `You receive an offer on your listing: ${listingName}`,
    wisetrade: `<a href="https://wise-trade.vercel.app/myListings/${listingId}">your listing</a>`,
  };
  return template;
};

const offerAcceptedTemplate = (email, listingName) => {
  const template = {
    title: 'Your offer has been accepted',
    email,
    notes: `Your offer to the listing ${listingName} has been accepted`,
    before: 'To approve the trade, go to',
    wisetrade:
      '<a href="https://wise-trade.vercel.app/approveTrades">pending trades</a>',
  };
  return template;
};

const offerRejectedTemplate = (email, listingName) => {
  const template = {
    title: 'Your offer has been rejected',
    email,
    notes: `Your offer to the listing ${listingName} has been rejected`,
    before: 'To see more listings, go to',
    wisetrade:
      '<a href="https://wise-trade.vercel.app/marketplace">marketplace</a>',
  };
  return template;
};

export default { offerTemplate, offerAcceptedTemplate, offerRejectedTemplate };
