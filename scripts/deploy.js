const { ethers } = require("hardhat");

async function main() {
    const [user] = await ethers.getSigners();

    // We get the contract to deploy
    // 0x58b5cede554a39666091f96c8058920df5906581 is the Locksmith purchaser on Unlock's side.
    const secretSigner = "0x58b5cede554a39666091f96c8058920df5906581"

    const PurchaseHook = await ethers.getContractFactory("PurchaseHook");
    const hook = await PurchaseHook.deploy(secretSigner);

    await hook.deployed();

    console.log("Hook deployed to:", hook.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });