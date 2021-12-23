
const hre = require("hardhat");
const { deployments, getNamedAccounts } = hre;
const { ethers } = require('hardhat');
const { ether, BN } = require('@openzeppelin/test-helpers');
import { func } from '../deploy/001_deploy_nnn.ts';

const one_nnn = new BN("1000000000000000000")



async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy

  let accounts = await ethers.getSigners()


  const deployerWallet = accounts[0]
  const deployer = accounts[0].address
  const novemWallet = "0x6bF37653e17655472F229F66227fBa2Ca4Fb3782"
  const mint_amount = new BN("5000")

  const NNN_Factory = await hre.ethers.getContractFactory("NNNToken");
  console.log("network name", hre.network.name)
  if (hre.network.name == 'hardhat') {
    const nnn_proxy = await ethers.getContract("NNNToken", deployer);
  } else if (hre.network.name == 'testnet') {
    console.log("on testnet")
    const nnn_proxy = await NNN_Factory.attach("0x343323ef6E13b83E347566dC54Fec90aD0b66d41")
  } else if (hre.network.name == 'mainnet') {
    const nnn_proxy = await NNN_Factory.attach("0xB4E44dCAa4828a188955DAff5D8261a5E4876e26")
  }
  console.log("nnn_proxy address: ", nnn_proxy.address)

  console.log("deployer address: ", deployer)

  const supply = await nnn_proxy.totalSupply();
  console.log(" token supply: ", supply.toString())

  const ownerBalance = await nnn_proxy.balanceOf(deployer);

  console.log(deployer, " contract deployer token balance: ", ownerBalance.toString())
  console.log("Novem Wallet balance before mint: ", (await nnn_proxy.balanceOf(novemWallet)).toString())


  await nnn_proxy.mint(novemWallet, (one_nnn.mul(mint_amount)).toString())
  console.log("minted:", mint_amount);

  const new_supply = await nnn_proxy.totalSupply();
  console.log("new token supply: ", new_supply.toString())
  console.log("Novem Wallet balance after mint: ", (await nnn_proxy.balanceOf(novemWallet)).toString())

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
