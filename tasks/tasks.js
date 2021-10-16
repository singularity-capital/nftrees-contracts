require("@nomiclabs/hardhat-web3");
require('dotenv').config();
const fs = require('fs');
/*const NFTreeFactoryABI = require("../artifacts/contracts/NFTreeFactory.sol/NFTreeFactory.json").abi;
const NFTreeABI = require("../artifacts/contracts/NFTree.sol/NFTree.json").abi;
const DAIABI = require("../artifacts/contracts/DAI.sol/DAI.json").abi;
const USDCABI = require("../artifacts/contracts/USDC.sol/USDC.json").abi;
const USDTABI = require("../artifacts/contracts/USDT.sol/USDT.json").abi;*/


task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();
  
    for (const account of accounts) {
      console.log(account.address);
    }
  });

task("balance", "Prints an account's balance")
  .addParam("account", "The account's address")
  .setAction(async (taskArgs) => {
    const account = web3.utils.toChecksumAddress(taskArgs.account);
    const balance = await web3.eth.getBalance(account);

    console.log(web3.utils.fromWei(balance, "ether"), "ETH");
  });

task("init", "Initializes contracts")
  .setAction(async (taskArgs) => {
    // set account
    [owner] = await hre.ethers.getSigners();

    // create contract instances
    var nftreeFactory = new web3.eth.Contract(NFTreeFactoryABI, process.env.NFTREE_FACTORY_ADDRESS);
    var nftree = new web3.eth.Contract(NFTreeABI, process.env.NFTREE_ADDRESS);

    // set purchase address in nftree contract
    //await nftree.methods.addWhitelist(process.env.NFTREE_FACTORY_ADDRESS).send({from: owner.address});

    // set token hashes
    await nftreeFactory.methods.addLevel(1, 10, process.env.TOKEN_URI_1).send({from: owner.address});
    await nftreeFactory.methods.addLevel(10, 100, process.env.TOKEN_URI_10).send({from: owner.address});
    await nftreeFactory.methods.addLevel(100, 1000, process.env.TOKEN_URI_100).send({from: owner.address});
    await nftreeFactory.methods.addLevel(1000, 10000, process.env.TOKEN_URI_1000).send({from: owner.address});
  });

task("getInformation", "Retrieves contract information")
  .setAction(async (taskArgs) => {
    // set account
    [owner] = await hre.ethers.getSigners();

    // create contract instances
    var nftreeFactory = new web3.eth.Contract(NFTreeFactoryABI, process.env.NFTREE_FACTORY_ADDRESS);
    var nftree = new web3.eth.Contract(NFTreeABI, process.env.NFTREE_ADDRESS);

    // get offramp wallet
    console.log("Treasury: ", await nftreeFactory.methods.getTreasury().call());

    //get purchase contract
    console.log("Whitelisted contracts: ", await nftree.methods.getValidWhitelists().call());

    //get nftree contract
    console.log("NFTree contract: ", await nftreeFactory.methods.getNFTreeContract().call());

    // get levels
    console.log("Levels: ", await nftreeFactory.methods.getValidLevels().call());

    // get coins
    console.log("coin list: ", await nftreeFactory.methods.getValidCoins().call());

    // get carbon offset
    //console.log("carbon offset: ", await nftree.methods.carbonOffset().call());
});

task("addToken", "Add token to purchase contract")
  .addParam("address", "Address of token")
  .addParam("token", "Name of token")
  .setAction(async (taskArgs) => {
    // set account
    [owner] = await hre.ethers.getSigners();

    // create contract instances
    var nftreeFactory = new web3.eth.Contract(NFTreeFactoryABI, process.env.NFTREE_FACTORY_ADDRESS);

    // add token to nftree contract
    await nftreeFactory.methods.addCoin(taskArgs.token, taskArgs.address).send({from: owner.address});
});

task("mint", "Mint token to address")
  .addParam("token", "Name of token")
  .setAction(async (taskArgs) => {
    // set account
    [owner] = await hre.ethers.getSigners();

    // create contract instances
    if(taskArgs.token == 'DAI'){
      var dai = new web3.eth.Contract(daiABI, process.env.DAI_ADDRESS);

      // mint token to owner
      await dai.methods.mint(owner.address).send({from: owner.address});
      var balance = await dai.methods.balanceOf(owner.address).call();
      console.log("DAI balance:", web3.utils.fromWei(balance, 'ether'));
    }
    else if (taskArgs.token == 'USDC') {
      var usdc = new web3.eth.Contract(usdcABI, process.env.USDC_ADDRESS);

      // mint token to owner
      await usdc.methods.mint(owner.address).send({from: owner.address});
      var balance = await usdc.methods.balanceOf(owner.address).call();
      console.log("USDC balance:", web3.utils.fromWei(balance, 'ether'));
    }
    else if (taskArgs.token == 'USDT') {
      var usdt = new web3.eth.Contract(usdtABI, process.env.USDT_ADDRESS);

      // mint token to owner
      await usdt.methods.mint(owner.address).send({from: owner.address});
      var balance = await usdt.methods.balanceOf(owner.address).call();
      console.log("USDT balance:", web3.utils.fromWei(balance, 'ether'));
    } else {
      console.log('enter valid coin');
    }
});

task("purchaseNFTree", "Purchase an nftree")
  .addParam("num", "Number of credits to purchase")
  .addParam("amount", "Amount of token")
  .addParam("token", "Name of token")
  .setAction(async (taskArgs) => {
    // set account
    [owner] = await hre.ethers.getSigners();
    console.log(owner.address);

    // create contract instances
    var purchase = new web3.eth.Contract(purchaseABI, process.env.PURCHASE_ADDRESS);
    var nftree = new web3.eth.Contract(nftreeABI, process.env.NFTREE_ADDRESS);
    var mycoin = new web3.eth.Contract(mycoinABI, process.env.MYCOIN_ADDRESS);

    // approve tokens to be used
    await mycoin.methods.approve(process.env.PURCHASE_ADDRESS, web3.utils.toWei(taskArgs.amount, "ether")).send({from: owner.address});

    // purchase nftree
    await purchase.methods.mintNFTree(taskArgs.num, web3.utils.toWei(taskArgs.amount, "ether"), taskArgs.token).send({from: owner.address});
    let balance = await nftree.methods.balanceOf(owner.address).call();
    console.log(web3.utils.fromWei(balance, 'ether'));
});



module.exports = {};