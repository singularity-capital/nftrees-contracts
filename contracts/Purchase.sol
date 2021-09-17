// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "./INFTree.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


/* Contract for NFtrees */

contract Purchase is Ownable {

    INFTree nftree;

    address treasury;
    uint256 coinCount;
    // we want to also keep track of tonnes offset per level, where totalOffset is the accumulation of offsets from every level
    uint256 totalOffset;
    uint256 costPerTonne;
    
    // is there a better way to store these mappings -> values?
    // perhaps creating a 'levels' struct that contains the necessary information
    mapping(uint256 => bool) levels;
    mapping(string => IERC20) coins;
    mapping(uint256 => string) coinNames;
    mapping(uint256 => string) tokenHash;

    // as an example
    struct level {
        uint256 tonnesOffset; // 1, 10, 100, 1000. etc.
        uint256 totalOffset; // counter for tonnes offset per level (tokens minted)
        string tokenHash; // metadata for the NFTree
    }

    // should we initialize levels or coins in the constructor ?
    // or just call the setLevel() and addToken() functions after deployment
    constructor()
    {
        coinCount = 0;
        totalOffset = 0;
    }
    

    function setNFTreeContract(address _nftreeContract) external{
        nftree = INFTree(_nftreeContract);
    }


    function getNFTreeContract() external view returns(INFTree){
        return(nftree);
    }


    function addToken(address _address, string memory _coin) external onlyOwner{
        coins[_coin] = IERC20(_address);
        coinNames[coinCount] = _coin;
        coinCount = coinCount + 1;
    }

    // necessary (good practice) to have setters and getters for all the data we are keeping track of
    function setTreasury(address _address) external onlyOwner{
        treasury = _address;
    }
    

    function getTreasury() external view onlyOwner returns(address){
        return(treasury);
    }
    

    function setTokenHash(uint256 _level, string memory _hash) public onlyOwner{
        tokenHash[_level] = _hash;
    }
    

    function getTokenHash(uint256 _level) external view onlyOwner returns(string memory){
        return(tokenHash[_level]);
    }
    

    function getTotalOffset() external view returns(uint256){
        return(totalOffset);
    }
    

    function setLevel(uint256 _level, bool value) public onlyOwner {
        levels[_level] = value;
    }


    function setCostPerTonne(uint256 _costPerTonne) public onlyOwner {
        costPerTonne = _costPerTonne;
    }

    function getCostPerTonne() external view returns(uint256) {
        return costPerTonne;
    }

    // because we cannot iterate through a mapping we need to have an additional mapping that stores the keys
    // is there a better / more effecient way to do this?
    function getCoins() external view returns(string[] memory){
        string[] memory coinList = new string[](coinCount);
        for(uint256 i = 0; i < coinCount; i++){
            coinList[i] = coinNames[i];
        }
        return(coinList);
    }


    function buyNFTree(uint256 _tonnes, uint256 _amount, string memory _coin) external {

        // are we missing any requires or logic to prevent faulty purchases / mints
        require(msg.sender != address(0) && msg.sender != address(this), 'Sending from zero address'); 
        require(levels[_tonnes] == true, 'Not a valid level');
        require(_amount >= _tonnes * costPerTonne * (10 ** 18), 'Not enough value');
        require(coins[_coin].balanceOf(msg.sender) >= _amount, 'Not enough balance');
        require(coins[_coin].allowance(msg.sender, address(this)) >= _amount, 'Not enough allowance');
        
        // transfer tokens
        coins[_coin].transferFrom(msg.sender, treasury, _amount);
        nftree.buyNFTree(msg.sender, tokenHash[_tonnes]);
        
        // add to total carbon offset log
        totalOffset = totalOffset + _tonnes;
    }
}
