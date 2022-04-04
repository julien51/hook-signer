const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PurchaseHook", function () {
  it("Should work", async function () {

    const [user] = await ethers.getSigners();
    const secretSigner = ethers.Wallet.createRandom()
    const lock = "0xd0A031d9f9486B1D914124D0C1FCAC2e9e6504FE" // Not use here
    const sender = "0xF5C28ce24Acf47849988f147d5C75787c0103534".toLowerCase()

    const PurchaseHook = await ethers.getContractFactory("PurchaseHook");
    const hook = await PurchaseHook.deploy(lock, secretSigner.address);
    await hook.deployed();


    // signing wrong message
    // expect(await hook.checkIsSigner(sender, await secretSigner.signMessage("hello"))).to.equal(false);
    // expect(await hook.checkIsSigner("hello", await secretSigner.signMessage(sender))).to.equal(false);

    // wrong signer
    // expect(await hook.checkIsSigner(sender, await user.signMessage(sender))).to.equal(false);

    // Correct signer, correct message
    const message = "hello"
    const secretSignerAddress = secretSigner.address
    const signedMessage = await secretSigner.signMessage(message)
    console.log({ signedMessage, message, secretSignerAddress })
    expect(ethers.utils.verifyMessage(message, signedMessage), secretSignerAddress)
    console.log(await hook.secretSigner())
    expect(await hook.checkIsSigner(message, signedMessage)).to.equal(true);
    // expect(await hook.checkIsSigner(sender, await secretSigner.signMessage(sender))).to.equal(true);


  });
});
