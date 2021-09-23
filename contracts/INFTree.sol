// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
//import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";

interface INFTree is IERC721{

    /**
        @dev see {NFTree-mintNFTree}
     */
    function mintNFTree(address _recipient, string memory _tokenURI, uint256 _carbonOffset, uint256 _treesPlanted) external;
}