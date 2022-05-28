// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.1;

import '@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract WiseTradeV1 is Ownable, IERC721Receiver {
    uint256 private _swapsCounter;
    uint256 private _etherLocked;

    mapping(uint256 => Swap) private _swaps;

    struct Swap {
        address payable initiator;
        address[] initiatorNftAddresses;
        uint256[] initiatorNftIds;
        uint256 initiatorEtherValue;
        address payable counterpart;
        address[] counterpartNftAddresses;
        uint256[] counterpartNftIds;
        uint256 counterpartEtherValue;
    }

    event SwapExecuted(
        address indexed from,
        address indexed to,
        uint256 indexed swapId
    );
    event SwapCanceled(address indexed canceledBy, uint256 indexed swapId);

    event SwapProposed(
        address indexed from,
        address indexed to,
        uint256 indexed swapId,
        address[] nftAddressInit,
        uint256[] nftIdsInit,
        address[] nftAddressescounter,
        uint256[] nftIdscounter,
        uint256 etherValue
    );

    modifier requireSameLength(
        address[] memory nftAddresses,
        uint256[] memory nftIds
    ) {
        require(
            nftAddresses.length == nftIds.length,
            'WiseTrade: NFT and ID arrays have to be same length'
        );
        _;
    }

    constructor(address contractOwnerAddress) {
        super.transferOwnership(contractOwnerAddress);
    }

    function proposeSwap(
        address counterpart,
        address[] calldata nftAddressesInit,
        uint256[] calldata nftIdsInit,
        address[] calldata nftAddressescounter,
        uint256[] calldata nftIdscounter
    )
        external
        payable
        requireSameLength(nftAddressesInit, nftIdsInit)
        requireSameLength(nftAddressescounter, nftIdscounter)
    {
        _swapsCounter += 1;

        safeMultipleTransfersFrom(
            msg.sender,
            address(this),
            nftAddressesInit,
            nftIdsInit
        );

        Swap storage swap = _swaps[_swapsCounter];
        swap.initiator = payable(msg.sender);
        swap.initiatorNftAddresses = nftAddressesInit;
        swap.initiatorNftIds = nftIdsInit;
        swap.counterpartNftAddresses = nftAddressescounter;
        swap.counterpartNftIds = nftIdscounter;

        swap.initiatorEtherValue = msg.value;
        _etherLocked += swap.initiatorEtherValue;

        swap.counterpart = payable(counterpart);

        emit SwapProposed(
            msg.sender,
            counterpart,
            _swapsCounter,
            swap.initiatorNftAddresses,
            nftIdsInit,
            nftAddressescounter,
            nftIdscounter,
            swap.initiatorEtherValue
        );
    }

    function acceptSwap(uint256 swapId) external payable {
        require(
            _swaps[swapId].counterpart == msg.sender,
            'WiseTrade: caller is not swap participator'
        );
        require(
            _swaps[swapId].counterpartEtherValue == 0,
            'WiseTrade: swap already initiated'
        );

        address[] memory _counterpartNftAddresses = _swaps[swapId]
            .counterpartNftAddresses;
        uint256[] memory tokenAddress = _swaps[swapId].counterpartNftIds;
        uint256 count = 0;
        for (uint256 i = 0; i < _counterpartNftAddresses.length; i++) {
            if (
                IERC721(_counterpartNftAddresses[i]).ownerOf(tokenAddress[i]) ==
                msg.sender
            ) {
                count += 1;
            }
        }

        if (count == _counterpartNftAddresses.length) {
            // transfer NFTs from escrow to initiator

            safeMultipleTransfersFrom(
                msg.sender,
                _swaps[swapId].initiator,
                _swaps[swapId].counterpartNftAddresses,
                _swaps[swapId].counterpartNftIds
            );

            _swaps[swapId].counterpartEtherValue = msg.value;
            _etherLocked += _swaps[swapId].counterpartEtherValue;

            safeMultipleTransfersFrom(
                address(this),
                _swaps[swapId].counterpart,
                _swaps[swapId].initiatorNftAddresses,
                _swaps[swapId].initiatorNftIds
            );

            emit SwapExecuted(
                _swaps[swapId].initiator,
                _swaps[swapId].counterpart,
                swapId
            );
            delete _swaps[swapId];
        } else {
            cancelSwap(swapId);
        }
    }

    /**
     * @dev Returns NFTs from WiseTrade to swap initator.
     *      Callable only if counter user hasn't yet added NFTs.
     *
     * @param swapId ID of the swap that the swap participants want to cancel
     */
    function cancelSwap(uint256 swapId) public {
        require(
            _swaps[swapId].initiator == msg.sender ||
                _swaps[swapId].counterpart == msg.sender,
            "WiseTrade: Can't cancel swap, must be swap participant"
        );
        // return initiator NFTs
        safeMultipleTransfersFrom(
            address(this),
            _swaps[swapId].initiator,
            _swaps[swapId].initiatorNftAddresses,
            _swaps[swapId].initiatorNftIds
        );

        if (_swaps[swapId].initiatorEtherValue != 0) {
            _etherLocked -= _swaps[swapId].initiatorEtherValue;
            uint256 amountToTransfer = _swaps[swapId].initiatorEtherValue;
            _swaps[swapId].initiatorEtherValue = 0;
            _swaps[swapId].initiator.transfer(amountToTransfer);
        }

        if (_swaps[swapId].counterpartEtherValue != 0) {
            _etherLocked -= _swaps[swapId].counterpartEtherValue;
            uint256 amountToTransfer = _swaps[swapId].counterpartEtherValue;
            _swaps[swapId].counterpartEtherValue = 0;
            _swaps[swapId].counterpart.transfer(amountToTransfer);
        }

        emit SwapCanceled(msg.sender, swapId);

        delete _swaps[swapId];
    }

    function safeMultipleTransfersFrom(
        address from,
        address to,
        address[] memory nftAddresses,
        uint256[] memory nftIds
    ) internal virtual {
        for (uint256 i = 0; i < nftIds.length; i++) {
            safeTransferFrom(from, to, nftAddresses[i], nftIds[i], '');
        }
    }

    function safeTransferFrom(
        address from,
        address to,
        address tokenAddress,
        uint256 tokenId,
        bytes memory _data
    ) internal virtual {
        IERC721(tokenAddress).safeTransferFrom(from, to, tokenId, _data);
    }

    function withdrawEther(address payable recipient) external onlyOwner {
        require(
            recipient != address(0),
            'WiseTrade: transfer to the zero address'
        );

        recipient.transfer((address(this).balance - _etherLocked));
    }

    function ReadCounter() external view returns (uint256) {
        return _swapsCounter;
    }

    function onERC721Received(
        /* solhint-disable */
        address operator,
        address from,
        uint256 tokenId,
        bytes memory data
    )
        external
        pure
        override
        returns (
            /* solhint-enable */
            bytes4
        )
    {
        return
            bytes4(
                keccak256('onERC721Received(address,address,uint256,bytes)')
            );
    }
}
