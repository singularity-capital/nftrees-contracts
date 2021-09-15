// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
//import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/* Contract for NFtrees */

contract NFTree is Ownable, ERC721URIStorage {
    uint256 tokenId;
    address purchaseContract;

    // should we use @openzeppelin/contracts/utils/Counters.sol ?
    // instead of manual tokenId
    constructor() ERC721('NFTree', 'TREE')
    {
        tokenId = 1;
    }
    
    function setPurchaseContract(address _purchaseContract) external onlyOwner{
        purchaseContract = _purchaseContract;
    }
    
    function getPurchaseContract() external view returns(address){
        return(purchaseContract);
    }

    function buyNFTree(address _recipient, string memory _tokenHash) external {
        require(msg.sender == purchaseContract, 'Only purchase contract can call buyNFTree');
        
        _safeMint(_recipient, tokenId);
        _setTokenURI(tokenId, _tokenHash);
        tokenId = tokenId + 1;
    }

    // should we use ERC721Enumerable.sol?
    // instead of creating our own function
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

    function getNextTokenId() external view returns(uint256){
        return(tokenId);
    }

}