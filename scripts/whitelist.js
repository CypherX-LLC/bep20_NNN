
const hre = require("hardhat");
const { deployments, getNamedAccounts } = hre;
const { ethers } = require('hardhat');
const { ether, BN } = require('@openzeppelin/test-helpers');
import { func } from '../deploy/001_deploy_nvm.ts';
//const timers = require('timers/promises')

const one_nvm = new BN("1000000000000000000")



async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy

  let accounts = await ethers.getSigners()

  const deployer = accounts[0].address

  const nvm_Factory = await hre.ethers.getContractFactory("NNNToken");
  console.log("network name", hre.network.name)
  if (hre.network.name == 'localhost') {
    const nvm_proxy = await ethers.getContract("NNNToken", deployer);
  } else if (hre.network.name == 'testnet') {
    console.log("on testnet")
    const nvm_proxy = await nvm_Factory.attach("0x343323ef6E13b83E347566dC54Fec90aD0b66d41")
  } else if (hre.network.name == 'mainnet') {
    const nvm_proxy = await nvm_Factory.attach("0x5d5c5c1d14faf8ff704295b2f502daa9d06799a0")
  }
  console.log("nvm_proxy address: ", nvm_proxy.address)

  console.log("deployer address: ", deployer)

  console.log("has whitelist role: ",await nvm_proxy.hasRole("0xbcaa5c4620c62b2fedc77ef4fe401724814aeef811d907416a737179a85b1ab2", "0xbd186632f17aC6881F952A6f03c617e00f2f7F74"));

  // DEX Trade exchange
  await nvm_proxy.grantRole("0xbcaa5c4620c62b2fedc77ef4fe401724814aeef811d907416a737179a85b1ab2", "0xD0ACB9C61cD72E0f57B19268D70c73b77DbDd553", { from: deployer });
  await timers.setTimeout(5000);
  console.log("has whitelist role: ",await nvm_proxy.hasRole("0xbcaa5c4620c62b2fedc77ef4fe401724814aeef811d907416a737179a85b1ab2", "0xD0ACB9C61cD72E0f57B19268D70c73b77DbDd553"));

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
