//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Transactions {
    event Transfer(address sender, address receiver, uint amount, string message) {

        function publishTransaction(address payable receiver, uint amount, string memory message) {
            emit Transfer();
        }
    }
}