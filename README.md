# NNN Token for Binance Smart Chain

Novem Gold Token

## Deployed

"DefaultProxyAdmin" https://bscscan.com/address/0x7aab82Eb8fB14aC34EAfafE76A27cE7e1614D193

"NVMToken_Implementation" https://bscscan.com/address/0x4Cdbd3D80036A05a3162D492287a0960dcE4A385

"NVMToken_Proxy" https://bscscan.com/address/0xB4E44dCAa4828a188955DAff5D8261a5E4876e26

Fee Address: https://bscscan.com/address/0x6bF37653e17655472F229F66227fBa2Ca4Fb3782

## Audit

https://github.com/selimerunkut/erc20_nnn/blob/042d8a88a483dede387a9f525c5c55430beadcd4/audit/Novem_Security_Audit_Report.pdf
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
