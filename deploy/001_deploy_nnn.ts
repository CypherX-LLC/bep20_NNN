import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {ethers} from 'hardhat';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  //let wei = ethers.utils.parseEther('300000000')
  const {deployments, getNamedAccounts} = hre;
  const {deploy} = deployments;

  const {deployer} = await getNamedAccounts();

  await deploy('NNNToken', {
    contract: 'NNNToken',
    from: deployer,
    proxy: {
      owner: deployer,
      proxyContract: 'OpenZeppelinTransparentProxy',
      execute: {
        init: {
          methodName: '__initialize',
          args: [],
        },
      },
    },
    log: true,
  });
  const nnnTokenContract = await ethers.getContract('NNNToken');
  await nnnTokenContract.setFeeWalletAddress("0xef7cD1379Ec7D0F673718343d19bDD59C165A7C6")

  //grant fee exclude roles
  //Ledger
  await nnnTokenContract.grantRole("0xbcaa5c4620c62b2fedc77ef4fe401724814aeef811d907416a737179a85b1ab2", "0xAbBBbac3E0CcF1a75D4eCCC6E47f249801033130")
  //Mario
  await nnnTokenContract.grantRole("0xbcaa5c4620c62b2fedc77ef4fe401724814aeef811d907416a737179a85b1ab2", "0x6bF37653e17655472F229F66227fBa2Ca4Fb3782")
  //Eicke
  await nnnTokenContract.grantRole("0xbcaa5c4620c62b2fedc77ef4fe401724814aeef811d907416a737179a85b1ab2", "0x368a7C44B55ef4383Be6D7E5f84Fb719A4aea320")
  //Blockchain MetaMask Wallet
  await nnnTokenContract.grantRole("0xbcaa5c4620c62b2fedc77ef4fe401724814aeef811d907416a737179a85b1ab2", "0xED3b232bCDe677037cABaaB174799Be35C58bc27")
  //deployer wallet
  await nnnTokenContract.grantRole("0xbcaa5c4620c62b2fedc77ef4fe401724814aeef811d907416a737179a85b1ab2", "0x2a9A4FDcd541Fa049cBb4cf2dAf8929735608dc1")



  //grant minter role
  await nnnTokenContract.grantRole("0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6", "0xBBfB485aa0937569ae94D3De26fbD51485A1eFdc")

  console.log("fee Divisor:",await nnnTokenContract.tokenTransferFeeDivisor())
  console.log("feeAddress:", await nnnTokenContract.feeAddress())
};

export default func;
func.tags = ['NNNToken'];
