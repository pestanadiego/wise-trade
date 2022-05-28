import { useContext } from 'react';
import styled from "styled-components";
import { UserContext } from '../../context/UserContext';
import { Colors, Devices } from "./Theme";
import NFTCard from "./styled/NFTCard.styled";
import Grid from "./styled/Grid.styled";
import Tabs from "./styled/Tabs.styled";
import Tab from "./styled/Tab.styled";
import { NFTs } from "./info";
const ProfileEl = styled.article`
  background-color: ${Colors.White};
  color: ${Colors.Black};
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 2rem;
  gap: 2rem;

  @media ${Devices.Laptop} {
    flex-direction: row;
  }
`;
const Info = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  @media ${Devices.Laptop} {
    max-width: 25vw;
    align-items: flex-start;
  }
`;

const Stats = styled.div`
  width: 100%;
  border-top: 1px solid ${Colors.Border};
  border-bottom: 1px solid ${Colors.Border};
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  align-items: center;
  justify-content: center;
`;
const StatItem = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
`;
const StatTitle = styled.span`
  color: ${Colors.Gray};
`;
const StatValue = styled.span`
  font-weight: 500;
`;

const AllTabs = [
  {
    Id: 1,
    Title: "Collectibles",
    Content: (
      <Grid>
        {NFTs.map((nft) => {
          return <NFTCard key={nft.Id} item={nft} />;
        })}
      </Grid>
    ),
  },
  { Id: 2, Title: "Pending", Content: <Tab /> },
  { Id: 3, Title: "Create", Content: (
    <Grid>
      <p>Create the Lists of NFTs</p>
    </Grid>
  ) },
  { Id: 4, Title: "Edit", Content: (
    <Grid>
      <p>Edit the Lists of NFTs</p>
    </Grid>
  ) },
  { Id: 5, Title: "Sold", Content: <Tab /> },
];


export default function MyList() {
    const { address } = useContext(UserContext);
  return (
    <section>
    {!address ? (
        <div>Connect your wallet to see your Listings</div>
      ) : (
    <ProfileEl>
      <Content>
        <Info>
          <Stats>
            <StatItem>
              <StatTitle>Created</StatTitle>
              <StatValue>3.8K</StatValue>
            </StatItem>
            <StatItem>
              <StatTitle>Sold</StatTitle>
              <StatValue>84K</StatValue>
            </StatItem>
            <StatItem>
              <StatTitle>Canceled</StatTitle>
              <StatValue>12</StatValue>
            </StatItem>
          </Stats>
        </Info>
        {/* Tabs */}
        <Tabs data={AllTabs} mt="2rem" />
      </Content>
    </ProfileEl>
    )}
    </section>
  );
}
