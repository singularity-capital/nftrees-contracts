// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
//import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract NFTree is Ownable, ERC721URIStorage {
    uint256 tokenId;
    address[] whitelists;
    
    mapping(address => Whitelist) whitelistMap;

    struct Whitelist {
        bool isValid;
        address contractAddress;
    }

    constructor() ERC721('NFTree', 'TREE')
    {
        tokenId = 1;
    }

    function addWhitelist(address _contractAddress) external onlyOwner{
        require(whitelistMap[_contractAddress].isValid, 'Contrat already whitelisted.');

        whitelistMap[_contractAddress] = Whitelist(true, _contractAddress);
        whitelists.push(_contractAddress);
    }

    function removeWhitelist(address _contractAddress) external onlyOwner {
        require(whitelistMap[_contractAddress].isValid, 'Not a valid whitelisted contract.');

        uint256 index;

        for (uint256 i = 0; i <= whitelists.length; i++) {
            if (whitelists[i] == _contractAddress) {
                index = i;
            }
        }

        whitelists[index] = whitelists[whitelists.length - 1];

        delete whitelists[whitelists.length - 1];
        delete whitelistMap[_contractAddress];
    }
    
    function getWhitelists() external view returns(address[] memory){
        return whitelists;
    }

    function getNextTokenId() external view returns(uint256){
        return tokenId;
    }

    function tokensOfOwner(address _owner) external view returns(uint256[] memory) {
        uint256 tokenCount = balanceOf(_owner);

        if (tokenCount == 0) {
            // Return an empty array
            return new uint256[](0);
        } else {

            uint256 resultIndex = 0;
            uint256[] memory result = new uint256[](tokenCount);

            for (uint256 NFTreeId = 1; NFTreeId <= tokenId - 1; NFTreeId++) {
                if (ownerOf(NFTreeId) == _owner) {
                    result[resultIndex] = NFTreeId;
                    resultIndex++;
                }
            }

            return result;
        }

    }

    function buyNFTree(address _recipient, string memory _tokenURI) external {
        require(whitelistMap[msg.sender].isValid, 'Only whitelisted addresses can mint NFTrees.');
        
        _safeMint(_recipient, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        tokenId = tokenId + 1;
    }

}