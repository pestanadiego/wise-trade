// First, we must import the schema creator
import createSchema from 'part:@sanity/base/schema-creator';

// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type';

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: 'default',
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat([
    {
      name: 'counter',
      title: 'Counter',
      type: 'document',
      fields: [
        {
          name: 'swapCounter',
          title: 'Swap Counter',
          type: 'number',
        },
      ],
    },
    {
      name: 'user',
      title: 'Users',
      type: 'document',
      fields: [
        {
          name: 'walletAddress',
          title: 'Wallet Address',
          type: 'string',
        },
        {
          name: 'email',
          title: 'Email',
          type: 'string',
        },
        {
          name: 'swaps',
          title: 'Swaps',
          type: 'array',
          of: [
            {
              type: 'swap',
              title: 'Swap',
            },
          ],
        },
      ],
    },
    {
      name: 'swap',
      title: 'Swaps',
      type: 'document',
      fields: [
        {
          name: 'idOfSwap',
          title: 'Id',
          type: 'number',
        },
        {
          name: 'from',
          title: 'From',
          type: 'string',
        },
        {
          name: 'to',
          title: 'To',
          type: 'string',
        },
        {
          name: 'initiatorNfts',
          title: 'Initiator NFTs',
          type: 'array',
          of: [
            {
              title: 'Initiator NFT',
              type: 'object',
              fields: [
                {
                  name: 'nid',
                  type: 'number',
                  title: 'Id Collection',
                },
                { name: 'image_url', type: 'string', title: 'Image Url' },
                { name: 'name', type: 'string', title: 'Name' },
                {
                  name: 'nftAddress',
                  type: 'string',
                  title: 'Collection Address',
                },
              ],
            },
          ],
        },
        {
          name: 'counterpartNfts',
          title: 'Counterpart NFTs',
          type: 'array',
          of: [
            {
              title: 'Counterpart NFT',
              type: 'object',
              fields: [
                {
                  name: 'id',
                  type: 'number',
                  title: 'Id Collection',
                },
                { name: 'image_url', type: 'string', title: 'Image Url' },
                { name: 'name', type: 'string', title: 'Name' },
                {
                  name: 'nftAddress',
                  type: 'string',
                  title: 'Collection Address',
                },
              ],
            },
          ],
        },
        {
          name: 'status',
          title: 'Status',
          type: 'string',
        },
      ],
    },
  ]),
});
