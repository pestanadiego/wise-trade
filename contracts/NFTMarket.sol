// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import "openzeppelin/contracts/token/ERC721/ERC721.sol";
import "openzeppelin/contracts/utils/Counters.sol";
import "openzeppelin/contracts/security/ReentrancyGuard.sol"; // Control de seguridad

contract NFTMarket is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemsIds;
    Counters.Counter private _itemsSold;

    address payable owner; // Quién es el dueño del NFT
    uint256 listingPrice = 0.025 ether; // Lo que cuesta

    constructor() {
        owner = payable(msg.sender);
    }

    struct MarketItem {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    mapping(uint256 => MarketItem) private idToMarketItem;

    // Para ver el evento desde el front-end
    event MarketItemCreated {
        uint indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    };

    function getListingPrice() public view return (uint256) {
        return listingPrice; // Util. Para ver el precio del listing
    }

    /* Funciones que interactúan con el contrato */

    // Para crear un item en el mercado:
    function createMarketItem(address nftContract, uint256 tokenId, uint256 price) public payable nonReentrant {
        require(price > 0, "El precio debe ser al menos 0.01 ETH")
        require(msg.value == listingPrice, "El precio debe ser igual al del precio del listado") // Cuando se haga la transacción, se debe pasar el monto para listar.
        _itemIds.increment();
        uint256 itemId = _itemIds.current();

        idToMarketItem[itemId] = MarketItem(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)), // Todavía no le pertenece a nadie
            price,
            false
        );

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit MarketItemCreated(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            address(0),
            price,
            false
        );
    }

    // Para crear la venta en el mercado:
    function createMarketSale(address nftContract, uint256 itemId) public payable nonReentrant {
        uint price = idToMarketItem[itemId].price;
        uint tokenId = idToMarketItem[itemId].tokenId;
        require(msg.value == price, "Por favor, ingrese el precio solicitado para completar la compra");
        
        idToMarketItem[itemId].seller.transfer(msg.value);
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        idToMarketItem[itemId].owner = payable(msg.sender);
        idToMarketItem[itemId].sold = true;
        _itemsSold.increment();
        payable(owner).transfer(listingPrice);
    }

    // Función que retorna todos los NFT no vendidos
    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint itemCount = _itemsIds.current();
        uint unsoldItemCount = _itemsIds.current() - _itemsSold.current();
        uint currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        for (uint i = 0; i < itemCount; i++) {
            if(idToMarketItem[i + 1].owner == address(0)) {
                uint currentId = idToMarketItem[i + 1].itemId;
                MarketItem storage currentItem = idToMarketItem[currentId];
                item[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }

    // Función que retorna los NFT comprados
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if(idToMarketItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if(idToMarketItem[i + 1].owner == msg.sender) {
                uint currentId = idToMarketItem[i + 1].itemId;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }

    // Función que retorna los NFT creados
    function fetchItemsCreated() public view return (MarketItem[] memory) {
        uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if(idToMarketItem[i + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if(idToMarketItem[i + 1].seller == msg.sender) {
                uint currentId = idToMarketItem[i + 1].itemId;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }

}
