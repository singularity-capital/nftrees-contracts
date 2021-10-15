const hre = require("hardhat");

async function main() {
  [owner] = await hre.ethers.getSigners();

  // deploy contracts
  nftreeBuilder = await ethers.getContractFactory("NFTree");
  nftree = await nftreeBuilder.deploy();
  console.log('NFTree contract deployed to: ', nftree.address);

  nftreeFactoryBuilder = await ethers.getContractFactory("NFTreeFactory");
  nftreeFactory = await nftreeFactoryBuilder.deploy(nftree.address, owner.address);
  console.log('NFTreeFactory contract deployed to: ', nftreeFactory.address);

  /*daiFactory = await ethers.getContractFactory("DAI");
  dai = await daiFactory.deploy(); 
  console.log('DAI contract deployed to: ', dai.address);

  usdcFactory = await ethers.getContractFactory("USDC");
  usdc = await usdcFactory.deploy(); 
  console.log('USDC contract deployed to: ', usdc.address);

  usdtFactory = await ethers.getContractFactory("USDT");
  usdt = await usdtFactory.deploy(); 
  console.log('USDT contract deployed to: ', usdt.address);*/
}
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });