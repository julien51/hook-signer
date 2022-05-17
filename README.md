# Captcha Hook for Locks

This project implements an Unlock PublicLock Hook that can be used on PublicLocks in order to ensure that users went through the Unlock front-end when sending their purchase transactions.

The Unlock Protocol team has deployed a version of this hook on the following networks:

- Polygon
- Gnosis Chain
- Rinkeby

It can also be deployed on other chains.

Please, make sure you use the `captcha` option in the `paywallConfig` object for the captcha to actually be completed and transactions to go through.
