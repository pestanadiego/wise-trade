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
        {
          name: 'listings',
          title: 'Listings',
          type: 'array',
          of: [
            {
              type: 'listing',
              title: 'Listing',
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
    {
      name: 'listing',
      title: 'Listings',
      type: 'document',
      fields: [
        {
          name: 'address',
          title: 'address',
          type: 'string',
        },
        {
          name: 'status',
          title: 'status',
          type: 'string',
        },
        {
          name: 'listTitle',
          title: 'title',
          type: 'string',
        },
        {
          name: 'listDescription',
          title: 'description',
          type: 'string',
        },
        {
          name: 'listNfts',
          title: 'nfts',
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
          name: 'listOffers',
          title: 'offers',
          type: 'array',
          of: [
            {
              name: 'offer',
              title: 'offer',
              type: 'document',
              fields: [
                {
                  name: 'createdAt',
                  title: 'createdAt',
                  type: 'date',
                },
                {
                  name: 'offerAddress',
                  title: 'address',
                  type: 'string',
                },
                {
                  name: 'offerNfts',
                  title: 'nfts',
                  type: 'array',
                  of: [
                    {
                      title: 'Counterpart NFT',
                      type: 'object',
                      fields: [
                        {
                          name: 'nid',
                          type: 'number',
                          title: 'Id Collection',
                        },
                        {
                          name: 'image_url',
                          type: 'string',
                          title: 'Image Url',
                        },
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
              ],
            },
          ],
        },
        {
          name: 'listTags',
          title: 'tags',
          type: 'array',
          of: [
            {
              title: 'tag',
              type: 'string',
            },
          ],
        },
      ],
    },
  ]),
});
