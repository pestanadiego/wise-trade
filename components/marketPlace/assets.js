/* eslint-disable jsx-a11y/alt-text */
import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { Colors, Devices } from '../myListings/Theme';
import { HiOutlineExternalLink } from 'react-icons/hi';
import { AiFillCaretLeft } from 'react-icons/ai';
import { IoMdShareAlt } from 'react-icons/io';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { BsHeart, BsFillEyeFill, BsThreeDots } from 'react-icons/bs';
import brokeape from '../../public/brokeape.svg';

const AssetEl = styled.article`
  background-color: ${Colors.White};
  color: ${Colors.Black};
  padding: 1rem;
  display: flex;
  flex-direction: column;

  @media ${Devices.Laptop} {
    padding: 1rem 15%;
  }
`;
const SectionContainer = styled.div`
  display: flex;
  gap: 2rem;
  flex-direction: column;
  @media ${Devices.Laptop} {
    flex-direction: row;
  }
`;

const LeftSection = styled.div`
  display: flex;
  flex: 0.7rem;
  flex-direction: column;
  gap: 1rem;
`;
const ImageEl = styled.div`
  border-radius: 30px;
  overflow: hidden;
`;
const ChainLink = styled.a`
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  font-size: 1rem;
  font-weight: 500;
  align-items: center;
  border: 1px solid ${Colors.Border};
  padding: 1.5rem 1rem;
`;
const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  flex: 0.95;
`;
const BackBtn = styled.span`
  color: ${Colors.Primary};
  display: flex;
  width: max-content;
  cursor: pointer;
  align-items: center;
`;
const TopBtns = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  svg {
    font-size: 1.5rem;
  }
`;

const LikesBtn = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ViewsEl = styled(LikesBtn)``;
const ShareBtn = styled(LikesBtn)``;
const MoreBtn = styled(LikesBtn)`
  margin-left: auto;
`;

const AuthorContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  span {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
`;
const AvatarEl = styled.div`
  border-radius: 50%;
  overflow: hidden;
  width: 50px;
  height: 50px;
`;
const CreatorLabel = styled.label`
  color: ${Colors.Gray};
  font-size: 0.9rem;
`;
const UsernameEl = styled.span``;
const EditionEl = styled.span`
  font-weight: 500;
`;
const Title = styled.h1`
  font-size: 1.7rem;
  display: inline-block;
  margin-right: 1rem;
`;
const MarketPlace = styled.span`
  border: 1px solid ${Colors.Gray};
  border-radius: 50px;
  padding: 0.2rem 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: ${Colors.Gray};
`;
const AcOfferLabel = styled.span`
  font-size: 1.2rem;
  font-weight: 500;
  color: ${Colors.Gray};
`;
const Des = styled.p`
  white-space: pre-wrap;
`;
const TagContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;
const Tag = styled.span`
  border: 1px solid ${Colors.Black};
  border-radius: 5px;
  padding: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
`;

export default function Asset() {
  const { address } = useContext(UserContext);
  return (
    <section>
      {!address ? (
        <div>Connect your wallet to see this page</div>
      ) : (
        <AssetEl>
          <SectionContainer>
            <LeftSection>
              <ImageEl>
                <Carousel>
                  <Image
                    src={brokeape}
                    layout="responsive"
                    width="1000px"
                    height="1000px"
                  />
                  <Image
                    src={brokeape}
                    layout="responsive"
                    width="1000px"
                    height="1000px"
                  />
                </Carousel>
              </ImageEl>
              <ChainLink>
                View NFT details <HiOutlineExternalLink />
              </ChainLink>
            </LeftSection>
            <RightSection>
              <Link href="/marketPlace">
                <BackBtn>
                  <AiFillCaretLeft />
                  Back
                </BackBtn>
              </Link>
              <TopBtns>
                <ViewsEl>
                  <BsFillEyeFill />
                  16177
                </ViewsEl>
                <Link href="/trade">
                  <ShareBtn className="cursor-pointer">
                    <IoMdShareAlt />
                    Make an offer
                  </ShareBtn>
                </Link>
                <MoreBtn>
                  <BsThreeDots />
                </MoreBtn>
              </TopBtns>
              <AuthorContainer>
                <span>
                  <CreatorLabel>Owner</CreatorLabel>
                  <UsernameEl>Address</UsernameEl>
                </span>
              </AuthorContainer>
              <EditionEl>371 Editions Minted</EditionEl>
              <span>
                <Title>LameCats</Title>
                <MarketPlace>Marketplace</MarketPlace>
              </span>
              <AcOfferLabel>Accepting Trades</AcOfferLabel>
              <Des>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur
              </Des>
              <TagContainer>
                <Tag>ERC721</Tag>
              </TagContainer>
            </RightSection>
          </SectionContainer>
        </AssetEl>
      )}
    </section>
  );
}
