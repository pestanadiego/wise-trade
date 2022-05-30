import styled from 'styled-components';
import { useContext } from 'react';
import { NFTs } from '../myListings/info';
import { Colors, Devices } from '../myListings/Theme';
import Grid from '../myListings/styled/Grid.styled';
import { UserContext } from '../../context/UserContext';
import NFTCard from '../myListings/styled/NFTCard.styled';

const TopCollectiblesEl = styled.article`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  padding: 1rem;

  @media ${Devices.Tablet} {
    padding: 1rem 3rem;
  }
  @media ${Devices.Laptop} {
    padding: 1rem 5%;
  }
  @media ${Devices.LaptopL} {
    padding: 1rem 10%;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 500;
`;
const TopSection = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
`;

const Sort = styled.div`
  border-radius: 30px;
  border: 1px solid ${Colors.Primary};
  padding: 0.4rem 1rem;
  cursor: pointer;
`;
const Date = styled.div`
  background: linear-gradient(
    to right,
    ${Colors.Gradients.PrimaryToSec[0]},
    ${Colors.Gradients.PrimaryToSec[1]}
  );
  border-radius: 30px;
  padding: 0.4rem 2.5rem;
`;

export default function MarketList() {
  const { address } = useContext(UserContext);
  return (
    <section>
      {!address ? (
        <div>Connect your wallet to see the MarketPlace</div>
      ) : (
        <TopCollectiblesEl>
          <Grid>
            {NFTs.map((nft) => {
              return (
                <a>
                  <NFTCard item={nft} />
                </a>
              );
            })}
          </Grid>
        </TopCollectiblesEl>
      )}
    </section>
  );
}
