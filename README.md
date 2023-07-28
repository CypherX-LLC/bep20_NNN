# NNN Token for Binance Smart Chain

Novem Gold Token

## Multisig

https://gnosis-safe.io/app/bnb:0xC12E74bC807387F96FEcccC8499014f6cbE5bF5C/home

## Deployed

"DefaultProxyAdmin" https://bscscan.com/address/0x2D0bd1eb6e8577A2e73C7Fd772e587a0dEc9A9c3

"NVMToken_Implementation" https://bscscan.com/address/0x2D0bd1eb6e8577A2e73C7Fd772e587a0dEc9A9c3

"NVMToken_Proxy" https://bscscan.com/address/0x5D5c5c1d14FaF8Ff704295b2F502dAA9D06799a0

## Audit

[Audit Report](audit/Novem_Security_Audit_Report.pdf)

## Technical Information

Upgradable ERC20 Contract for the Binance Smart Chain

Using OpenZeppelin contracts.

Thanks for the outstanding work of openzeppelin, audited contracts and the great and instant support from their team.

### mint and burn

change receiver address and mint ammount for minting in scripts/mint.js

`yarn mint_nnn`

change burn ammount in scripts/burn.js

`yarn burn_nnn`

### some hardhat console commands

initialize contract:

`const nnn_Factory = await ethers.getContractFactory("NNNToken")`

`const nnn_proxy = await nnn_Factory.attach("0xB4E44dCAa4828a188955DAff5D8261a5E4876e26")`

example mint of 2 NNN tokens

`await nnn_proxy.mint("<to_wallet_address>", "2000000000000000000")`

add fee exclude role

`const FEE_EXCLUDED_ROLE = "0xbcaa5c4620c62b2fedc77ef4fe401724814aeef811d907416a737179a85b1ab2"`

`await nnn_proxy.grantRole(FEE_EXCLUDED_ROLE, "<to_wallet_address>")`


check if fee will excluded from address while transfer

`await nnn_proxy.hasRole(FEE_EXCLUDED_ROLE, "<a_wallet_address>")`

### Verify

`yarn hardhat --network testnet etherscan-verify`

## Execute functions using BSC Scan

https://bscscan.com/address/0x5d5c5c1d14faf8ff704295b2f502daa9d06799a0#writeProxyContract

https://bscscan.com/address/0x5d5c5c1d14faf8ff704295b2f502daa9d06799a0#readProxyContract

# Using Openzeppelin Defender for contract calls:

https://defender.openzeppelin.com/

## Create new proposal

choose `Admin action`

<img width="953" alt="Screenshot 2023-07-27 at 16 43 36" src="https://github.com/CypherX-LLC/multisig_doc/assets/31136147/581a4280-aeeb-4141-84ed-1470a5f1af1d">

Enter function name

`Execution strategy` is `Multisig`
enter NNN Multisig address: `0xC12E74bC807387F96FEcccC8499014f6cbE5bF5C` (if needed)

Describe the proposal and click `Create Admin action`

<img width="794" alt="Screenshot 2023-07-27 at 16 18 41" src="https://github.com/CypherX-LLC/multisig_doc/assets/31136147/d6a44f48-93ff-42fb-8317-062227b8da51">

You can ignore the warnings/errors and `Approve` the transaction

### Gnosis Multisig

The transaction should be visible in  Gnosis Multisig Queue:

https://app.safe.global/transactions/queue?safe=bnb:0xC12E74bC807387F96FEcccC8499014f6cbE5bF5C

Send the above address to the other signing wallet(s)

## Multisig doc is here:
[USING-MULTISIG-WALLET.md](https://github.com/CypherX-LLC/multisig_doc/blob/b0c5619f1174c42176bca02b838effc03e8edf89/docs/USING-MULTISIG-WALLET.md)
