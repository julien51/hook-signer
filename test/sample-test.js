const { expect } = require("chai");
const { ethers, unlock } = require("hardhat");

describe("PurchaseHook", function () {
  it("Should work", async function () {

    const [user] = await ethers.getSigners();
    const secretSigner = ethers.Wallet.createRandom()
    const sender = "0xF5C28ce24Acf47849988f147d5C75787c0103534".toLowerCase()

    const PurchaseHook = await ethers.getContractFactory("PurchaseHook");
    const hook = await PurchaseHook.deploy(secretSigner.address);
    await hook.deployed();


    // signing wrong message
    expect(await hook.checkIsSigner(sender, await secretSigner.signMessage("hello"))).to.equal(false);
    expect(await hook.checkIsSigner("hello", await secretSigner.signMessage(sender))).to.equal(false);

    // wrong signer
    expect(await hook.checkIsSigner(sender, await user.signMessage(sender))).to.equal(false);

    // Correct signer, correct message
    const message = "hello"
    const messageHash = ethers.utils.solidityKeccak256(
      ['string'],
      [message.toLowerCase()]
    )
    const signedMessage = await secretSigner.signMessage(ethers.utils.arrayify(messageHash))
    expect(ethers.utils.verifyMessage(message, signedMessage), secretSigner.address)
    expect(await hook.checkIsSigner(message, signedMessage)).to.equal(true);
  });

  it('should work as a hook', async function () {
    const [user, another, aThird] = await ethers.getSigners();
    const secretSigner = ethers.Wallet.createRandom()

    await unlock.deployProtocol()
    const expirationDuration = 60 * 60 * 24 * 7
    const maxNumberOfKeys = 100
    const keyPrice = 0

    const { lock } = await unlock.createLock({
      expirationDuration,
      maxNumberOfKeys,
      keyPrice,
      name: 'ticket'
    })
    await (await lock.setMaxKeysPerAddress(10)).wait()
    const PurchaseHook = await ethers.getContractFactory("PurchaseHook");
    const hook = await PurchaseHook.deploy(secretSigner.address);
    await hook.deployed();
    await (await lock.setMaxKeysPerAddress(10)).wait()

    // Set the hook on avatar
    await (await lock.setEventHooks(
      hook.address, // onKeyPurchaseHook,
      ethers.constants.AddressZero, // onKeyCancelHook,
      ethers.constants.AddressZero, // onValidKeyHook,
      ethers.constants.AddressZero, // onTokenURIHook
    )).wait()


    const messageHash = ethers.utils.solidityKeccak256(
      ['string'],
      [user.address.toLowerCase()]
    )
    const signedMessage = await secretSigner.signMessage(ethers.utils.arrayify(messageHash))

    const anotherMessageHash = ethers.utils.solidityKeccak256(
      ['string'],
      [another.address.toLowerCase()]
    )
    const anotherSignedMessage = await secretSigner.signMessage(ethers.utils.arrayify(anotherMessageHash))


    // Health check!
    expect(ethers.utils.verifyMessage(user.address.toLowerCase(), signedMessage), secretSigner.address)
    expect(await hook.checkIsSigner(user.address.toLowerCase(), signedMessage)).to.equal(true);

    // Let's now purchase a key!
    const tx = await lock.purchase([0], [user.address, another.address], [user.address, another.address], [user.address, another.address], [signedMessage, anotherSignedMessage])
    const receipt = await tx.wait()

    // Let's now purchase a key with the wrong signed message
    await expect(lock.purchase([0], [aThird.address], [aThird.address], [aThird.address], [signedMessage])).to.revertedWith("WRONG_SIGNATURE")

    // Let's now purchase a key with no signed message
    await expect(lock.purchase([0], [aThird.address], [aThird.address], [aThird.address], [[]])).to.revertedWith("ECDSA: invalid signature length")

  })

});
