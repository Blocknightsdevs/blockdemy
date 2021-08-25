// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {LibDiamond} from "../../shared/libraries/LibDiamond.sol";
import {AppStorage} from "../libraries/LibAppStorage.sol";
import {LibMeta} from "../../shared/libraries/LibMeta.sol";

contract BlockdemyTokenFacet {
 AppStorage internal s;

    uint256 constant MAX_UINT = type(uint256).max;

    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    function name() external pure returns (string memory) {
        return "BLOCKDEMY";
    }

    function symbol() external pure returns (string memory) {
        return "BDMY";
    }

    function decimals() external pure returns (uint8) {
        return 18;
    }

    function totalSupply() public view returns (uint256) {
        return s.totalSupply;
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        balance = s.balances[_owner];
    }

    function addApprovedContract(address _contract) external {
        LibDiamond.enforceIsContractOwner();
        require(s.approvedContractIndexes[_contract] == 0, "BlockdemyTokenFacet: Approved contract already exists");
        s.approvedContracts.push(_contract);
        s.approvedContractIndexes[_contract] = s.approvedContracts.length;
    }

    function removeApprovedContract(address _contract) external {
        LibDiamond.enforceIsContractOwner();
        uint256 index = s.approvedContractIndexes[_contract];
        require(index > 0, "BlockdemyTokenFacet: Approved contract does not exist");
        uint256 lastIndex = s.approvedContracts.length;
        if (index != lastIndex) {
            address lastContract = s.approvedContracts[lastIndex - 1];
            s.approvedContracts[index - 1] = lastContract;
            s.approvedContractIndexes[lastContract] = index;
        }
        s.approvedContracts.pop();
        delete s.approvedContractIndexes[_contract];
    }

    function approvedContracts() external view returns (address[] memory contracts_) {
        contracts_ = s.approvedContracts;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        address sender = LibMeta.msgSender();
        _approve(sender,_spender,_value);
        success = true;
    }

    function increaseAllowance(address _spender, uint256 _value) external returns (bool success) {
        address sender = LibMeta.msgSender();
        uint256 l_allowance = s.allowances[sender][_spender];
        uint256 newAllowance = l_allowance + _value;
        require(newAllowance >= l_allowance, "BlockdemyTokenFacet: Allowance increase overflowed");
        _approve(LibMeta.msgSender(), _spender, newAllowance);
        success = true;
    }

    function decreaseAllowance(address _spender, uint256 _value) external returns (bool success) {
        address sender = LibMeta.msgSender();
        uint256 currentAllowance = s.allowances[sender][_spender];
        require(currentAllowance >= _value, "BlockdemyTokenFacet: decreased allowance below zero");
        unchecked {
            _approve(sender, _spender, currentAllowance - _value);
        }

        success = true;
    }

    function _approve(
        address owner,
        address spender,
        uint256 amount
    ) internal virtual {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");
        s.allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }
    
    function allowance(address _owner, address _spender) public view returns (uint256 remaining_) {
        remaining_ = s.allowances[_owner][_spender];
    }

     function transfer(address _to, uint256 _value) public returns (bool success) {
        _transfer(LibMeta.msgSender(), _to, _value);
        success = true;
    }

    //should check zeppelin
    function _transfer(address sender,address _to, uint256 _value) public returns (bool success) {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(_to != address(0), "ERC20: transfer to the zero address");
        
        uint256 frombalances = s.balances[sender];
        require(frombalances >= _value, "BDMY: Not enough BDMY to transfer");
        unchecked {
            s.balances[sender] = frombalances - _value;
        }
        s.balances[_to] += _value;
        emit Transfer(sender, _to, _value);
        success=true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        _transfer(_from, _to, _value);

        address sender = LibMeta.msgSender();
        if (sender == _from || s.approvedContractIndexes[sender] > 0) {
            // pass
        } else {
            uint256 l_allowance = s.allowances[_from][sender];
            require(l_allowance >= _value, "BDMY: Not allowed to transfer");
            if (l_allowance != MAX_UINT) {
                _approve(_from,sender,l_allowance - _value);
            }
        }
        success = true;
    }

    function mint(address account, uint256 amount) external {
        require(account != address(0), "ERC20: mint to the zero address");
        LibDiamond.enforceIsContractOwner();
        s.balances[account] += amount;
        s.totalSupply += uint256(amount);
        emit Transfer(address(0), account, amount);
    }
}