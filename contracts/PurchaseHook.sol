//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@unlock-protocol/contracts/dist/PublicLock/IPublicLockV9.sol";
import "hardhat/console.sol";

contract PurchaseHook {
    address public secretSigner;
    address public lock;

    constructor(address _lock, address _secretSigner) {
        secretSigner = _secretSigner;
        lock = _lock;
    }

    function changeSigner(address _secretSigner) public {
        require(
            IPublicLockV9(lock).isLockManager(msg.sender),
            "NOT_LOCK_MANAGER"
        );
        secretSigner = _secretSigner;
    }

    /**
     * Debug function
     */
    function checkIsSigner(
        string memory message,
        bytes calldata signature /* data */
    ) public view returns (bool isSigner) {
        bytes memory encoded = abi.encodePacked(message);
        bytes32 messageHash = keccak256(encoded);
        bytes32 hash = ECDSA.toEthSignedMessageHash(messageHash);
        address recoveredAddress = ECDSA.recover(hash, signature);
        console.log(
            "recoveredAddress %s : secretSigner %s",
            recoveredAddress,
            secretSigner
        );
        return recoveredAddress == secretSigner;
    }

    /**
     * Price is the same for everyone... but we fail if signature does not match!
     */
    function keyPurchasePrice(
        address from, /* from */
        address, /* recipient */
        address, /* referrer */
        bytes calldata signature /* data */
    ) external view returns (uint256 minKeyPrice) {
        string memory message = toString(from);
        console.log(message);
        require(checkIsSigner(message, signature), "WRONG_SIGNATURE");
        if (address(msg.sender).code.length > 0) {
            return IPublicLockV9(msg.sender).keyPrice();
        }
        return 0;
    }

    /**
     * Helper functions to turn addrerss into string so we can verify the signature (address is signed as string on the client)
     */
    function toString(address account) public pure returns (string memory) {
        return toString(abi.encodePacked(account));
    }

    function toString(uint256 value) public pure returns (string memory) {
        return toString(abi.encodePacked(value));
    }

    function toString(bytes32 value) public pure returns (string memory) {
        return toString(abi.encodePacked(value));
    }

    function toString(bytes memory data) public pure returns (string memory) {
        bytes memory alphabet = "0123456789abcdef";

        bytes memory str = new bytes(2 + data.length * 2);
        str[0] = "0";
        str[1] = "x";
        for (uint256 i = 0; i < data.length; i++) {
            str[2 + i * 2] = alphabet[uint256(uint8(data[i] >> 4))];
            str[3 + i * 2] = alphabet[uint256(uint8(data[i] & 0x0f))];
        }
        return string(str);
    }

    /**
     *
     */
    function onKeyPurchase(
        address, /*from*/
        address, /*recipient*/
        address, /*referrer*/
        bytes calldata, /*data*/
        uint256, /*minKeyPrice*/
        uint256 /*pricePaid*/
    ) external {
        /** no-op. this should have failed earlier if data is not the right signature  */
    }
}