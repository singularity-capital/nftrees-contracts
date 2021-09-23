const { expect } = require("chai");
const BigNumber = require('bignumber.js');

describe("Token contract", function () {
    let nftreeFactoryBuilder;
    let nftreeFactory;
    let nftreeBuilder;
    let nftree
    let daiFactory;
    let dai
    let usdcFactory;
    let usdc
    let usdtFactory;
    let usdt
    let owner;
    let customer;
    let wallet;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  before(async function () {
    // Get the ContractFactory and Signers here.
    [owner, customer, wallet] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens onces its transaction has been
    // mined.
    nftreeBuilder = await ethers.getContractFactory("NFTree");
    nftree = await nftreeBuilder.deploy();
    console.log('NFTree contract deployed to: ', nftree.address);

    nftreeFactoryBuilder = await ethers.getContractFactory("NFTreeFactory");
    nftreeFactory = await nftreeFactoryBuilder.deploy(nftree.address, wallet.address);
    console.log('NFTreeFactory contract deployed to: ', nftreeFactory.address);

    daiFactory = await ethers.getContractFactory("DAI");
    dai = await daiFactory.deploy(); 
    console.log('DAI contract deployed to: ', dai.address);

    usdcFactory = await ethers.getContractFactory("USDC");
    usdc = await usdcFactory.deploy(); 
    console.log('USDC contract deployed to: ', usdc.address);

    usdtFactory = await ethers.getContractFactory("USDT");
    usdt = await usdtFactory.deploy(); 
    console.log('USDT contract deployed to: ', usdt.address);
  });

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    // `it` is another Mocha function. This is the one you use to define your
    // tests. It receives the test name, and a callback function.

    // If the callback function is async, Mocha will `await` it.
    it("Should set the right owner", async function () {
      // Expect receives a value, and wraps it in an Assertion object. These
      // objects have a lot of utility methods to assert values.

      // This test expects the owner variable stored in the contract to be equal
      // to our Signer's owner.
      expect(await nftreeFactory.owner()).to.equal(owner.address);
      expect(await nftree.owner()).to.equal(owner.address);
    });
  });

  describe("Setters and Getters", function () {
    // `it` is another Mocha function. This is the one you use to define your
    // tests. It receives the test name, and a callback function.

    it("Sets/Gets NFTree address", async function () {
        // set the Purchase contract address in the NFTree contract
        await nftreeFactory.setNFTreeContract(nftree.address);
        expect(await nftreeFactory.getNFTreeContract()).to.equal(nftree.address);
    });

    it("Sets/Gets treasury address", async function () {
      // set the Purchase contract address in the NFTree contract
      await nftreeFactory.setTreasury(wallet.address);
      expect(await nftreeFactory.getTreasury()).to.equal(wallet.address);
    });
  });

  describe("Levels", function () {
    // `it` is another Mocha function. This is the one you use to define your
    // tests. It receives the test name, and a callback function.

    it("Add multiple levels", async function () {
        await nftreeFactory.addLevel(1, 1, 10, "1 carbon credit");
        await nftreeFactory.addLevel(10, 10, 100, "10 carbon credit");
        await nftreeFactory.addLevel(100, 100, 1000, "100 carbon credit");
        await nftreeFactory.addLevel(1000, 1000, 10000, "1000 carbon credit");
        var levels = await nftreeFactory.getValidLevels();

        expect(levels[0].toNumber()).to.equal(1);
        expect(levels[1].toNumber()).to.equal(10);
        expect(levels[2].toNumber()).to.equal(100);
        expect(levels[3].toNumber()).to.equal(1000);
    });

    it("Get level", async function () {
      //console.log(await nftreeFactory.getLevel(1));
    });

    it("Update level", async function () {
      //await nftreeFactory.addLevel(1, 20, "1 carbon credit updated");
    });

    it("Remove levels", async function () {
      // set the Purchase contract address in the NFTree contract
      //await nftreeFactory.removeLevel(1);
      //console.log("remove levels: " + await nftreeFactory.getValidLevels());
    });
  });

  describe("Coins", function () {
    
    it("Add coins", async function () {
      await nftreeFactory.addCoin('DAI', dai.address);
      await nftreeFactory.addCoin('USDC', usdc.address);
      await nftreeFactory.addCoin('USDT', usdt.address);
      var coinList = ['DAI', 'USDC', 'USDT'];
      var coinList = await nftreeFactory.getValidCoins();

      expect(coinList[0]).to.equal('DAI');
      expect(coinList[1]).to.equal('USDC');
      expect(coinList[2]).to.equal('USDT');
    });

    it("Remove coin", async function () {
      // set the Purchase contract address in the NFTree contract
      //await nftreeFactory.removeCoin('DAI');
      //console.log("remove levels: " + await nftreeFactory.getValidCoins());
    });
  });

  describe("Whitelist", function () {
    
    it("Add whitelist", async function () {
      await nftree.addWhitelist(nftreeFactory.address);
      var whitelists = await nftree.getValidWhitelists();

      expect(whitelists[0]).to.equal(nftreeFactory.address);
    });

    it("remove whitelist", async function () {
      //await nftree.removeWhitelist(nftreeFactory.address);
      //console.log(await nftree.getValidWhitelists());
    });
  });

  describe("Mint and Approve tokens", function () {
    
    it("Mint tokens", async function () {
      await dai.mint(customer.address);
      await usdc.mint(customer.address);
      await usdt.mint(customer.address);
      
      expect(await dai.balanceOf(customer.address)).to.equal(web3.utils.toWei('1000','ether'));
      expect(await usdc.balanceOf(customer.address)).to.equal(web3.utils.toWei('1000','ether'));
      expect(await usdt.balanceOf(customer.address)).to.equal(web3.utils.toWei('1000','ether'));
    });

    it("Approve tokens", async function () {
      await dai.connect(customer).approve(nftreeFactory.address, web3.utils.toWei('1000','ether'));
      await usdc.connect(customer).approve(nftreeFactory.address, web3.utils.toWei('1000','ether'));
      await usdt.connect(customer).approve(nftreeFactory.address, web3.utils.toWei('1000','ether'));

      expect(await dai.allowance(customer.address, nftreeFactory.address)).to.equal(web3.utils.toWei('1000','ether'));
      expect(await usdc.allowance(customer.address, nftreeFactory.address)).to.equal(web3.utils.toWei('1000','ether'));
      expect(await usdt.allowance(customer.address, nftreeFactory.address)).to.equal(web3.utils.toWei('1000','ether'));
    });
  });

  describe("Purchase", function () {
    
    it("Should purchase correctly", async function () {
      // purchase NFTree
      await nftreeFactory.connect(customer).mintNFTree(1, 10, 'DAI');
      console.log('tokens of owner: ' + await nftree.tokensOfOwner(customer.address));

      await nftreeFactory.connect(customer).mintNFTree(1, 10, 'USDC');
      console.log('tokens of owner: ' + await nftree.tokensOfOwner(customer.address));

      await nftreeFactory.connect(customer).mintNFTree(1, 10, 'USDT');
      console.log('tokens of owner: ' + await nftree.tokensOfOwner(customer.address));

      console.log(await nftree.tokenURI(1));
      console.log(await nftree.tokenURI(2));
      console.log(await nftree.tokenURI(3));
    });

    it("Should offramp correctly", async function () {
      expect(await dai.balanceOf(wallet.address)).to.equal(web3.utils.toWei('10','ether'));
      expect(await usdc.balanceOf(wallet.address)).to.equal(web3.utils.toWei('10','ether'));
      expect(await usdt.balanceOf(wallet.address)).to.equal(web3.utils.toWei('10','ether'));
    });

    it("total offset", async function () {
      console.log("total offset: " + await nftree.totalOffset);
    });

    it("numMinted", async function () {
      console.log("Level 1 Struct: " + await nftreeFactory.getLevel(1));
    });

    it("trees planted", async function () {
      console.log("Level 1 Struct: " + await nftree.treesPlanted);
    });
  });
});
