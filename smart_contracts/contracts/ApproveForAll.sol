pragma solidity ^0.8.1;

import '@openzeppelin/contracts/token/ERC721/IERC721.sol';

contract ApproveForAll {
    function approveForAll(
        address to,
        address[] calldata nftAddresses,
        uint256[] calldata nftIds
    ) public {
        for (uint256 i = 0; i < nftAddresses.length; i++) {
            IERC721(nftAddresses[i]).approve(to, nftIds[i]);
        }
    }
}
