// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

/* solhint-disable avoid-low-level-calls */
/* solhint-disable no-inline-assembly */
/* solhint-disable reason-string */

import '@account-abstraction/contracts/core/BaseAccount.sol';
import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';

/**
 * minimal account.
 *  this is sample minimal account.
 *  has execute, eth handling methods
 *  has a single signer that can send requests through the entryPoint.
 */
contract ComplexWallet is BaseAccount {
  using ECDSA for bytes32;

  //explicit sizes of nonce, to fit a single storage cell with "owner"
  uint96 private _nonce;
  // address public owner;

  address[] public signers;
  address[] public guardians;

  mapping(address => bool) public isSigner;
  mapping(address => bool) public isGuardian;

  function nonce() public view virtual override returns (uint256) {
    return _nonce;
  }

  function entryPoint() public view virtual override returns (IEntryPoint) {
    return _entryPoint;
  }

  IEntryPoint private _entryPoint;

  event EntryPointChanged(address indexed oldEntryPoint, address indexed newEntryPoint);

  // solhint-disable-next-line no-empty-blocks
  receive() external payable {}

  constructor(IEntryPoint anEntryPoint, address[] memory _signers, address[] memory _guardians) {
    _entryPoint = anEntryPoint;
    signers = _signers;
    guardians = _guardians;

    for (uint i = 0; i < _signers.length; i++) {
      isSigner[_signers[i]] = true;
    }

    for (uint i = 0; i < _guardians.length; i++) {
      isGuardian[_guardians[i]] = true;
    }
  }

  modifier onlyOwner() {
    _onlyOwner();
    _;
  }

  function _onlyOwner() internal view {
    //directly from EOA owner, or through the entryPoint (which gets redirected through execFromEntryPoint)
    require(isSigner[msg.sender] || msg.sender == address(this), 'only owner');
  }

  /**
   * transfer eth value to a destination address
   */
  function transfer(address payable dest, uint256 amount) external onlyOwner {
    dest.transfer(amount);
  }

  /**
   * execute a transaction (called directly from owner, not by entryPoint)
   */
  function exec(address dest, uint256 value, bytes calldata func) external onlyOwner {
    _call(dest, value, func);
  }

  /**
   * execute a sequence of transaction
   */
  function execBatch(address[] calldata dest, bytes[] calldata func) external onlyOwner {
    require(dest.length == func.length, 'wrong array lengths');
    for (uint256 i = 0; i < dest.length; i++) {
      _call(dest[i], 0, func[i]);
    }
  }

  /**
   * change entry-point:
   * an account must have a method for replacing the entryPoint, in case the the entryPoint is
   * upgraded to a newer version.
   */
  function _updateEntryPoint(address newEntryPoint) internal override {
    emit EntryPointChanged(address(_entryPoint), newEntryPoint);
    _entryPoint = IEntryPoint(payable(newEntryPoint));
  }

  function _requireFromAdmin() internal view override {
    _onlyOwner();
  }

  /**
   * validate the userOp is correct.
   * revert if it doesn't.
   * - must only be called from the entryPoint.
   * - make sure the signature is of our supported signer.
   * - validate current nonce matches request nonce, and increment it.
   * - pay prefund, in case current deposit is not enough
   */
  function _requireFromEntryPoint() internal view override {
    require(msg.sender == address(entryPoint()), 'account: not from EntryPoint');
  }

  // called by entryPoint, only after validateUserOp succeeded.
  function execFromEntryPoint(address dest, uint256 value, bytes calldata func) external {
    _requireFromEntryPoint();
    _call(dest, value, func);
  }

  /// implement template method of BaseAccount
  function _validateAndUpdateNonce(UserOperation calldata userOp) internal override {
    require(_nonce++ == userOp.nonce, 'account: invalid nonce');
  }

  /// implement template method of BaseAccount
  function _validateSignature(
    UserOperation calldata userOp,
    bytes32 userOpHash,
    address
  ) internal virtual override returns (uint256 deadline) {
    bytes32 hash = userOpHash.toEthSignedMessageHash();
    //ignore signature mismatch of from==ZERO_ADDRESS (for eth_callUserOp validation purposes)
    // solhint-disable-next-line avoid-tx-origin
    address signer = hash.recover(userOp.signature);
    require(isSigner[signer] || tx.origin == address(0), 'account: wrong signature');
    return 0;
  }

  function _call(address target, uint256 value, bytes memory data) internal {
    (bool success, bytes memory result) = target.call{value: value}(data);
    if (!success) {
      assembly {
        revert(add(result, 32), mload(result))
      }
    }
  }

  /**
   * check current account deposit in the entryPoint
   */
  function getDeposit() public view returns (uint256) {
    return entryPoint().balanceOf(address(this));
  }

  /**
   * deposit more funds for this account in the entryPoint
   */
  function addDeposit() public payable {
    (bool req, ) = address(entryPoint()).call{value: msg.value}('');
    require(req);
  }

  /**
   * withdraw value from the account's deposit
   * @param withdrawAddress target to send to
   * @param amount to withdraw
   */
  function withdrawDepositTo(address payable withdrawAddress, uint256 amount) public onlyOwner {
    entryPoint().withdrawTo(withdrawAddress, amount);
  }

  function addGuardian(address _guardian) public onlyOwner {
    require(!isGuardian[_guardian], 'This address is already a guardian');

    guardians.push(_guardian);
    isGuardian[_guardian] = true;
  }

  function removeGuardian(address _guardian) public onlyOwner {
    require(isGuardian[_guardian], 'This address is not a guardian');

    for (uint i = 0; i < guardians.length; i++) {
      if (guardians[i] == _guardian) {
        guardians[i] = guardians[guardians.length - 1];
        guardians.pop();
        break;
      }
    }

    isGuardian[_guardian] = false;
  }

  function addSigner(address _signer) public onlyOwner {
    require(!isSigner[_signer], 'This address is already a signer');

    signers.push(_signer);
    isSigner[_signer] = true;
  }

  function removeSigner(address _signer) public onlyOwner {
    // bytes32 hash = keccak256(abi.encodePacked("RS", _signer, nonce()))
    //     .toEthSignedMessageHash();

    // require(hash.recover(_signature) == owner, "account: wrong signature");
    require(isSigner[_signer], 'This address is not a signer');

    for (uint i = 0; i < signers.length; i++) {
      if (signers[i] == _signer) {
        signers[i] = signers[signers.length - 1];
        signers.pop();
        break;
      }
    }

    isSigner[_signer] = false;
  }

  function recoverWallet(address _newSigner, bytes[] memory _signatures) public {
    require(_signatures.length == guardians.length, 'Invalid signatures length');
    bytes32 hash = keccak256(abi.encodePacked('RW', address(this), _newSigner, _nonce++)).toEthSignedMessageHash();

    for (uint i = 0; i < _signatures.length; i++) {
      require(hash.recover(_signatures[i]) == guardians[i], 'Invalid signatures');
    }

    signers.push(_newSigner);
    isSigner[_newSigner] = true;
  }
}
