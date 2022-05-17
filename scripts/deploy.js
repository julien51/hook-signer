const { ethers } = require("hardhat");

async function main() {
    const [user] = await ethers.getSigners();

    // We get the contract to deploy
    const lock = "0x072149617e12170696481684598a696e9a4d46Ff"
    const secretSigner = "0x58b5cede554a39666091f96c8058920df5906581" // Will need to be changed!

    const PurchaseHook = await ethers.getContractFactory("PurchaseHook");
    const hook = await PurchaseHook.deploy(lock, secretSigner);

    await hook.deployed();

    console.log("Hook deployed to:", hook.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });