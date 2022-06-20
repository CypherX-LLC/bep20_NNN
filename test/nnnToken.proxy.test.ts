// Load dependencies
import {expect} from './chai-setup';
import {ethers, deployments, getUnnamedAccounts} from 'hardhat';
import {NNNToken} from '../typechain';
import {setupUsers} from './utils';
import {FEE, TOKEN_NAME, TOKEN_SYMBOL, ZERO_ADDRESS, FEE_EXCLUDED_ROLE} from './include_in_tesfiles.js';

const setup = deployments.createFixture(async () => {
  await deployments.fixture('NNNToken');

  const contracts = {
    NNNToken: <NNNToken>await ethers.getContract('NNNToken'),
  };
  const users = await setupUsers(await getUnnamedAccounts(), contracts);
  return {
    ...contracts,
    users,
  };
});

// Start test block
describe('NNNToken', function () {
  before(async function () {
    const {users, NNNToken} = await setup();
    NNNToken.setFeeWalletAddress(users[1].address);
    NNNToken.setTransferFeeDivisor(FEE);
  });

  it('name should be ' + TOKEN_NAME, async function () {
    const {users, NNNToken} = await setup();
    expect((await NNNToken.name()).toString()).to.equal(TOKEN_NAME);
  });

  it('symbol should be ' + TOKEN_SYMBOL, async function () {
    const {users, NNNToken} = await setup();
    expect((await NNNToken.symbol()).toString()).to.equal(TOKEN_SYMBOL);
  });

  it('has 18 decimals', async function () {
    const {users, NNNToken} = await setup();
    expect(await NNNToken.decimals()).to.equal(18);
  });

  it('transfer fee should be 1/' + FEE, async function () {
    const {users, NNNToken} = await setup();
    let tokenTransferFeeDivisor = await NNNToken.tokenTransferFeeDivisor();
    //first we need to convert solidities big number to a string and then to a number
    expect(Number(tokenTransferFeeDivisor.toString())).to.eq(FEE);
  });

  it('transfer fee should be greater than 0', async function () {
    const {users, NNNToken} = await setup();
    let tokenTransferFeeDivisor = await NNNToken.tokenTransferFeeDivisor();
    expect(Number(tokenTransferFeeDivisor.toString())).to.be.greaterThan(0);
  });

  it('transfer address should be ', async function () {
    const {users, NNNToken} = await setup();
    let feeAddress = await NNNToken.feeAddress();
    expect(feeAddress.toString(), users[1].address);
  });

  it('exclude role should be ' + FEE_EXCLUDED_ROLE, async function () {
    const {users, NNNToken} = await setup();
    let feeExcludeRole = await NNNToken.FEE_EXCLUDED_ROLE();
    expect(feeExcludeRole.toString()).to.equal(FEE_EXCLUDED_ROLE);
  });


  it('change owner', async function () {
    const {users, NNNToken} = await setup();
    //console.log("owner address:",await NNNToken.owner())
    await NNNToken.transferOwnership(users[2].address);
    //console.log("users[2].address",users[2].address)
    //console.log("owner address:",await NNNToken.owner())
    expect((await NNNToken.owner()).toString()).to.equal(users[2].address);
  });

  it('mint tokens without decimal places and sent to address WITHOUT substracting a fee', async function () {
    const {users, NNNToken} = await setup();
    NNNToken.mintWithoutDecimals(users[0].address, 1, false);
    let balance = (await NNNToken.balanceOf(users[0].address)).toString();
    expect(balance).to.equal('1000000000000000000');
  });

  it('should mint tokens, send coins between accounts, fee should be collected', async function () {
    const {users, NNNToken} = await setup();
    let transferAmountWithDecimalplaces = 1000000000000000000;
    await NNNToken.mint(users[0].address, transferAmountWithDecimalplaces.toString());
    await users[0].NNNToken.transfer(users[3].address, transferAmountWithDecimalplaces.toString());
    let balance = (await NNNToken.balanceOf(users[3].address)).toString();
    const calculatedBalance = transferAmountWithDecimalplaces - transferAmountWithDecimalplaces / FEE
    expect(balance).to.be.equal(calculatedBalance.toString());
  });

  it("should collect fee, using transferFrom method sending tokens between accounts", async function () {
    const {users, NNNToken} = await setup();
    const transferAmount = 10000000000000000000;

    await NNNToken.mintWithoutDecimals(users[4].address, 10, false)
    expectEqualStringValues((await NNNToken.balanceOf(users[4].address)).toString(), transferAmount.toString());

    // we need to approve the contract deployer address to spend (transfer) the tokens from account 4
    await users[4].NNNToken.approve(users[0].address, transferAmount.toString())
    await users[0].NNNToken.transferFrom(users[4].address, users[5].address, transferAmount.toString())
    let account5Balance = (await NNNToken.balanceOf(users[5].address)).toString()
    expectEqualStringValues(account5Balance, transferAmount - (transferAmount / FEE))


    const mintingFeeAccount = (await NNNToken.feeAddress()).toString()
    let feeCollectorAccountBalance = (await NNNToken.balanceOf(mintingFeeAccount)).toString()
    expectEqualStringValues(feeCollectorAccountBalance, transferAmount / FEE)
  });

  it('mint coins and transfer with fee to account, fee should be collected', async function () {
    const {users, NNNToken} = await setup();
    const transferAmount = 10000000000000000000;

    await NNNToken.mintWithoutDecimals(users[0].address, 10, false);
    let balance = (await NNNToken.balanceOf(users[0].address)).toString();
    expectEqualStringValues(balance, transferAmount)

    await NNNToken.mintWithFee(users[4].address, transferAmount.toString());
    let accountBalance = (await NNNToken.balanceOf(users[4].address)).toString();
    expectEqualStringValues(accountBalance, transferAmount - transferAmount / FEE)


    const mintingFeeAccount = (await NNNToken.feeAddress()).toString();
    let feeCollectorAccountBalance = (await NNNToken.balanceOf(mintingFeeAccount)).toString();
    expectEqualStringValues(feeCollectorAccountBalance, transferAmount / FEE)

  });

  it('grant fee exclude role to address', async function () {
    const {users, NNNToken} = await setup();
    NNNToken.grantRole(FEE_EXCLUDED_ROLE, users[1].address);
    let hasFeeExcludeRole = (await NNNToken.hasRole(FEE_EXCLUDED_ROLE, users[1].address)).toString();
    expectEqualStringValues(hasFeeExcludeRole, true)
  });

  it('sets minting fee address', async function () {
    const {users, NNNToken} = await setup();
    let newFeeAdddress = users[7].address;
    NNNToken.setFeeWalletAddress(newFeeAdddress);
    expectEqualStringValues(await NNNToken.feeAddress(), newFeeAdddress)
  });

  it('sets minting fee divisor', async function () {
    const {users, NNNToken} = await setup();
    let newFee = 1000;
    NNNToken.setTransferFeeDivisor(1000);
    expectEqualStringValues(await NNNToken.tokenTransferFeeDivisor(), newFee)
  });

  it('sets minting fee divisor to 0 and throws exception', async function () {
    const {users, NNNToken} = await setup();
    await expect(NNNToken.setTransferFeeDivisor(0)).to.be.revertedWith(
      'Token transfer fee divisor must be greater than 0'
    );
  });

  it('reverts when transferring tokens to the zero address', async function () {
    const {users, NNNToken} = await setup();
    await expect(NNNToken.transfer(ZERO_ADDRESS, 1000)).to.be.revertedWith(
      'ERC20: transfer to the zero address'
    );
  });

  it('reverts when setting invalid fee address', async function () {
    const {users, NNNToken} = await setup();
    await expect(NNNToken.setFeeWalletAddress(ZERO_ADDRESS)).to.be.revertedWith('zero address is not allowed');
  });

  function expectEqualStringValues(value1, value2) {
		expect(value1.toString()).to.equal(value2.toString())
	}
});
