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
  await nnnTokenContract.setTransferFeeDivisor(400)
  await nnnTokenContract.setFeeWalletAddress("0xef7cD1379Ec7D0F673718343d19bDD59C165A7C6")
  console.log("fee Divisor:",await nnnTokenContract.tokenTransferFeeDivisor())
  console.log("feeAddress:", await nnnTokenContract.feeAddress())
};

export default func;
func.tags = ['NNNToken'];
