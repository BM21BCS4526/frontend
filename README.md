**smart contract integration with frontend**

In this project, I have created a smart contract for depositing and withdrawing an amount from an account and integrating it with the frontend.



**Description**

The front end of the application and smart contracts are linked together in this project using the Ethers.js package. I've employed a straightforward smart contract 
that allows for both deposit and withdrawal of monies via its withdraw function. Additionally, verify the status of the contract before closing it.  
The front end of the application can be used to call any of these smart contract functions.

**Getting Started**

Code is compiled and deployed on hardhat using the command: npx hardhat node and npx hardhat run --network localhost scripts/deploy.js
pragma solidity ^0.8.9;

//import "hardhat/console.sol";

contract Assessment {
    address payable public owner;
    uint256 public balance;
    bool public contractOpen = true;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns (uint256) {
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        uint _previousBalance = balance;

        // make sure this is the owner
        require(msg.sender == owner, "You are not the owner of this account");

        // perform transaction
        balance += _amount;

        // assert transaction completed successfully
        assert(balance == _previousBalance + _amount);

        // emit the event
        emit Deposit(_amount);
    }

    // custom error
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        // withdraw the given amount
        balance -= _withdrawAmount;

        // assert the balance is correct
        assert(balance == (_previousBalance - _withdrawAmount));

        // emit the event
        emit Withdraw(_withdrawAmount);
    }

    function getOwner() public view returns (address) {
        return owner;
    }


  

    function isContractOpen() public view returns (bool) {
        return contractOpen;
    }

    function closeContract() public {
        require(msg.sender == owner, "You are not the owner of this account");
        contractOpen = false;
    }
}

**Author**
Baby Monal
