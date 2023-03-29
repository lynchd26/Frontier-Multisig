// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract FrontierMultisig {
    // State variables
    address[] public owners;
    address[] public originalOwners;
    uint public approvalsRequired = 1;
    uint public denialsRequired = 1;
    mapping (address => bool) public isOwner;
    mapping (address => bool) public isOriginalOwner;
    Transaction[] public transactions;
    mapping (uint => mapping (address => bool)) public approvals;
    mapping (uint => mapping (address => bool)) public denials;

    // Events
    event Deposit(address indexed sender, uint value);
    event SubmitTransaction(address indexed owner, uint indexed txIndex, address indexed to, uint value, bytes data);
    event ApproveTransaction(address indexed owner, uint indexed txIndex);
    event RevokeTransaction(address indexed owner, uint indexed txIndex);
    event ExecuteTransaction(address indexed owner, uint indexed txIndex);
    event OwnerAddition(address indexed owner);  // Add new owner
    event OwnerRemoval(address indexed owner);   // Remove owner, must be done by original owner, decrease required approvals
    event ApprovalRequirementChange(uint required);  // Change the number of approvals required to execute a transaction
    event DenyTransaction(address indexed owner, uint indexed txIndex); // Make a way to create a number of owners that can deny a transaction before it is cancelled
    event DenyRequirementChange(uint required);  // Change the number of deny's required to cancel a transaction

    /* Create a transaction type with the to address, value of tx,
     data being sent & if the tx is executed */
    struct Transaction {
        address to;
        uint value;
        bytes data;
        bool executed;
        bool denied;
    }
    
    /* Make sure the owners added in the constructor can't be removed */
    constructor (address owner) {
        require(owner != address(0), "owner is the zero address");
        isOwner[owner] = true;
        owners.push(owner);
        isOriginalOwner[owner] = true;
        originalOwners.push(owner);
    }

    /* Function to allow deposits into the contract */
    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }


    /* Function to submit a transaction to the contract */
    function submitTransaction(address to, uint value, bytes memory data) public {
        require(isOwner[msg.sender], "User is not an owner");   // Must be an owner to submit tx
        uint txIndex = transactions.length;
        transactions.push(Transaction({
            to: to,
            value: value,
            data: data,
            executed: false,
            denied: false
        }));
        emit SubmitTransaction(msg.sender, txIndex, to, value, data);
    }

    /* Function to approve a transaction */
    function approveTransaction(uint txIndex) public {
        require(isOwner[msg.sender], "User is not an owner");                                       // Must be an owner to approve tx
        require(!approvals[txIndex][msg.sender], "User has already approved this transaction");     // Don't allow duplicate approvals
        if (denials[txIndex][msg.sender] == true) {
            revokeTransaction(txIndex);                                                 // call revokeTransaction if already denied
        }
        approvals[txIndex][msg.sender] = true;                                                      // Set approval from the owner to true
        uint currentApprovals = getTransactionApprovals(txIndex);
        uint requiredApprovals = approvalsRequired;
        if (currentApprovals >= requiredApprovals) {
            executeTransaction(txIndex);                                                // call executeTransaction if approvals are met
        }
        emit ApproveTransaction(msg.sender, txIndex);
    }

    function denyTransaction(uint txIndex) public {
        require(isOwner[msg.sender], "User is not an owner");                                       // Must be an owner to deny tx
        require(!denials[txIndex][msg.sender], "User has already denied this transaction");     // Don't allow duplicate denials
        if (approvals[txIndex][msg.sender] == true) {
            revokeTransaction(txIndex);                                                 // call revokeTransaction if already approved
        }
        denials[txIndex][msg.sender] = true;                                                      // Set denial from the owner to true    
        uint currentDenials = getTransactionDenials(txIndex);
        uint requiredDenials = denialsRequired;
        if (currentDenials >= requiredDenials) {
            transactions[txIndex].denied = true;                                                // call executeTransaction if approvals are met
        }
        emit DenyTransaction(msg.sender, txIndex);

    }

    /* Function to revoke a transaction */
    function revokeTransaction(uint txIndex) public {
        require(isOwner[msg.sender], "User is not an owner");                                       // Must be an owner to revoke tx
        require(approvals[txIndex][msg.sender] || denials[txIndex][msg.sender], "User has not approved or denied this transaction");          // Don't allow revoking if haven't already approved/denied
        approvals[txIndex][msg.sender] = false;                                                     // Set approval from the owner to false
        denials[txIndex][msg.sender] = false;                                                       // Set denial from the owner to false
        emit RevokeTransaction(msg.sender, txIndex);
    }

    /* Function to get current number of approvals */
    function getTransactionApprovals(uint txIndex) public view returns (uint) {
        uint count = 0;
        for (uint i = 0; i < owners.length; i++) {
            if (approvals[txIndex][owners[i]]) {
                count += 1;
            }
        }
        return count;
    }

    /* Function to get current number of denials */
    function getTransactionDenials(uint txIndex) public view returns (uint) {
        uint count = 0;
        for (uint i = 0; i < owners.length; i++) {
            if (denials[txIndex][owners[i]]) {
                count += 1;
            }
        }
        return count;
    }

    /* Function to execute a transaction */
    function executeTransaction(uint txIndex) public payable {
        require(isOwner[msg.sender], "User is not an owner");                                                           // Must be an owner to execute tx
        // require(getTransactionApprovals(txIndex) >= 2, "Transaction has not been approved by enough owners");      // Number of approvals must be greater than the set requirement
        require(!transactions[txIndex].executed, "Transaction has already been executed");                              // Don't allow duplicate executions
        require(!transactions[txIndex].denied, "Transaction has been denied");                                        // Don't allow execution if transaction has been denied
        transactions[txIndex].executed = true;
        (bool success, ) = transactions[txIndex].to.call{value: transactions[txIndex].value}(transactions[txIndex].data);
        require(success, "Transaction failed");
        emit ExecuteTransaction(msg.sender, txIndex);
    }

    /* Function to add an owner */
    function addOwner(address owner) public {
        require(isOwner[msg.sender], "User is not an owner");   // Must be an owner to add an owner
        require(owner != address(0), "owner is the zero address");
        require(!isOwner[owner], "owner already added");
        isOwner[owner] = true;
        owners.push(owner);
        emit OwnerAddition(owner);
    }
    
    /* Function to remove an owner */
    function removeOwner(address owner) public {       
        require(!isOriginalOwner[owner], "User is an original owner so cannot be removed");
        require(isOwner[msg.sender], "User is not an owner");   // Must be an owner to remove an owner
        require(owner != address(0), "owner is the zero address");
        require(isOwner[owner], "owner is not an owner");
        isOwner[owner] = false;
        for (uint i = 0; i < owners.length - 1; i++) {
            if (owners[i] == owner) {
                owners[i] = owners[owners.length - 1];
                break;
            }
        }
        owners.pop();
        emit OwnerRemoval(owner);
    }
    
    /* Function to get the contract balance */
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
    
    /* Function to get the number of owners */
    function getOwners() public view returns (address[] memory) {
        return owners;
    }

    /* Function to get the number of approvals required */
    function getApprovalsRequired() public view returns (uint) {
        return approvalsRequired;
    }

    /* Function to get the number of denials required */
    function getDenialsRequired() public view returns (uint) {
        return denialsRequired;
    }

    function getPendingTransactions() public view returns (address[] memory, uint[] memory, bytes[] memory, bool[] memory, bool[] memory) {
        uint pendingCount = 0;
        for (uint i = 0; i < transactions.length; i++) {
            if (!transactions[i].executed && !transactions[i].denied) {
                pendingCount++;
            }
        }

        address[] memory to = new address[](pendingCount);
        uint[] memory value = new uint[](pendingCount);
        bytes[] memory data = new bytes[](pendingCount);
        bool[] memory executed = new bool[](pendingCount);
        bool[] memory denied = new bool[](pendingCount);

        uint currentIndex = 0;
        for (uint i = 0; i < transactions.length; i++) {
            if (!transactions[i].executed && !transactions[i].denied) {
                to[currentIndex] = transactions[i].to;
                value[currentIndex] = transactions[i].value;
                data[currentIndex] = transactions[i].data;
                executed[currentIndex] = transactions[i].executed;
                denied[currentIndex] = transactions[i].denied;
                currentIndex++;
            }
        }
        return (to, value, data, executed, denied);
    }


    /* Function to change the number of approvals required */
    function changeApprovalsRequired(uint _approvalsRequired) public {
        require(isOriginalOwner[msg.sender], "User is not an original owner, so cannot change approvals required");
        address[] memory walletOwners = getOwners();
        require(_approvalsRequired > 0 && _approvalsRequired <= walletOwners.length, "Approvals required must be greater than 0 and less than or equal to the number of owners");
        approvalsRequired = _approvalsRequired;
        emit ApprovalRequirementChange(_approvalsRequired);
    }

    /* Function to change the number of denials required */
    function changeDenialsRequired(uint _denialsRequired) public {
        require(isOriginalOwner[msg.sender], "User is not an original owner, so cannot change denials required");
        address[] memory walletOwners = getOwners();
        require(_denialsRequired > 0 && _denialsRequired <= walletOwners.length, "Denials required must be greater than 0 and less than or equal to the number of owners");
        denialsRequired = _denialsRequired;
        emit DenyRequirementChange(_denialsRequired);
    }

    /* Function to check how many approvals a transaction has */
    function getTransactionApprovalCount(uint txIndex) public view returns (uint) {
        uint count = 0;
        for (uint i = 0; i < owners.length; i++) {
            if (approvals[txIndex][owners[i]]) {
                count += 1;
            }
        }
        return count;
    }

    /* Function to check how many denials a transaction has */
    function getTransactionDenialCount(uint txIndex) public view returns (uint) {
        uint count = 0;
        for (uint i = 0; i < owners.length; i++) {
            if (denials[txIndex][owners[i]]) {
                count += 1;
            }
        }
        return count;
    }

}
// Byte data example --> 0xe73620c3000000000000000000000000000000000000000000000000000000000000007b

