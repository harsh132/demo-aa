// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

import './ComplexWallet.sol';

/**
 * a sampler deployer contract for SimpleWallet
 * the "initCode" for a wallet hold its address and a method call (deployWallet) with parameters, not actual constructor code.
 */
contract ComplexWalletDeployer {
  function deployWallet(
    IEntryPoint entryPoint,
    address[] memory _signers,
    address[] memory _guardians,
    uint256 salt
  ) public returns (ComplexWallet) {
    return new ComplexWallet{salt: bytes32(salt)}(entryPoint, _signers, _guardians);
  }

  function getDeploymentAddress(
    IEntryPoint entryPoint,
    address[] memory _signers,
    address[] memory _guardians,
    uint256 salt
  ) public view returns (address) {
    address predictedAddress = address(
      uint160(
        uint256(
          keccak256(
            abi.encodePacked(
              bytes1(0xff),
              address(this),
              salt,
              keccak256(
                abi.encodePacked(type(ComplexWallet).creationCode, abi.encode(entryPoint, _signers, _guardians))
              )
            )
          )
        )
      )
    );

    return predictedAddress;
  }
}
