// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title CyberPunk Storage Contract
 * @dev Filecoin FVM smart contract for decentralized storage with USDFC payments
 * @author CyberPunk Team
 */
contract CyberPunkStorage is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    // Events
    event FileStored(bytes32 indexed fileId, address indexed owner, uint256 size, uint256 cost);
    event FileRetrieved(bytes32 indexed fileId, address indexed requester);
    event PaymentReceived(address indexed payer, uint256 amount);
    event StorageFeeUpdated(uint256 newFee);
    event BridgeTransaction(bytes32 indexed fileId, uint256 targetChain, uint256 bridgeFee);

    // Structs
    struct FileInfo {
        bytes32 fileId;
        address owner;
        uint256 size;
        uint256 cost;
        uint256 timestamp;
        bool isActive;
        string metadata;
    }

    struct BridgeInfo {
        bytes32 fileId;
        uint256 sourceChain;
        uint256 targetChain;
        uint256 bridgeFee;
        bool isCompleted;
    }

    // State variables
    Counters.Counter private _fileIdCounter;
    Counters.Counter private _bridgeIdCounter;
    
    uint256 public storageFeePerGB = 0.1 ether; // 0.1 USDFC per GB
    uint256 public bridgeFee = 0.05 ether; // 0.05 USDFC for cross-chain bridge
    
    mapping(bytes32 => FileInfo) public files;
    mapping(bytes32 => BridgeInfo) public bridges;
    mapping(address => bytes32[]) public userFiles;
    mapping(address => uint256) public userBalances;

    // Modifiers
    modifier onlyFileOwner(bytes32 fileId) {
        require(files[fileId].owner == msg.sender, "Not file owner");
        _;
    }

    modifier fileExists(bytes32 fileId) {
        require(files[fileId].owner != address(0), "File does not exist");
        _;
    }

    /**
     * @dev Store a file with metadata
     * @param size File size in bytes
     * @param metadata File metadata (IPFS hash, etc.)
     */
    function storeFile(uint256 size, string memory metadata) 
        external 
        payable 
        nonReentrant 
        returns (bytes32 fileId) 
    {
        require(msg.value >= calculateStorageCost(size), "Insufficient payment");
        require(bytes(metadata).length > 0, "Metadata required");

        _fileIdCounter.increment();
        fileId = keccak256(abi.encodePacked(block.timestamp, msg.sender, _fileIdCounter.current()));

        uint256 cost = calculateStorageCost(size);
        
        files[fileId] = FileInfo({
            fileId: fileId,
            owner: msg.sender,
            size: size,
            cost: cost,
            timestamp: block.timestamp,
            isActive: true,
            metadata: metadata
        });

        userFiles[msg.sender].push(fileId);
        userBalances[msg.sender] += msg.value - cost;

        emit FileStored(fileId, msg.sender, size, cost);
        emit PaymentReceived(msg.sender, msg.value);
    }

    /**
     * @dev Retrieve file information
     * @param fileId Unique file identifier
     */
    function retrieveFile(bytes32 fileId) 
        external 
        fileExists(fileId) 
        returns (FileInfo memory) 
    {
        require(files[fileId].isActive, "File is not active");
        
        emit FileRetrieved(fileId, msg.sender);
        return files[fileId];
    }

    /**
     * @dev Bridge file to another chain
     * @param fileId File to bridge
     * @param targetChain Target chain ID
     */
    function bridgeFile(bytes32 fileId, uint256 targetChain) 
        external 
        payable 
        nonReentrant 
        onlyFileOwner(fileId) 
        fileExists(fileId) 
    {
        require(msg.value >= bridgeFee, "Insufficient bridge fee");
        require(files[fileId].isActive, "File is not active");

        _bridgeIdCounter.increment();
        bytes32 bridgeId = keccak256(abi.encodePacked(fileId, targetChain, _bridgeIdCounter.current()));

        bridges[bridgeId] = BridgeInfo({
            fileId: fileId,
            sourceChain: block.chainid,
            targetChain: targetChain,
            bridgeFee: bridgeFee,
            isCompleted: false
        });

        emit BridgeTransaction(fileId, targetChain, bridgeFee);
        emit PaymentReceived(msg.sender, msg.value);
    }

    /**
     * @dev Complete bridge transaction
     * @param bridgeId Bridge transaction ID
     */
    function completeBridge(bytes32 bridgeId) 
        external 
        onlyOwner 
    {
        require(bridges[bridgeId].fileId != bytes32(0), "Bridge does not exist");
        require(!bridges[bridgeId].isCompleted, "Bridge already completed");

        bridges[bridgeId].isCompleted = true;
    }

    /**
     * @dev Update storage fee (owner only)
     * @param newFee New fee per GB
     */
    function updateStorageFee(uint256 newFee) external onlyOwner {
        require(newFee > 0, "Fee must be greater than 0");
        storageFeePerGB = newFee;
        emit StorageFeeUpdated(newFee);
    }

    /**
     * @dev Update bridge fee (owner only)
     * @param newFee New bridge fee
     */
    function updateBridgeFee(uint256 newFee) external onlyOwner {
        require(newFee > 0, "Fee must be greater than 0");
        bridgeFee = newFee;
    }

    /**
     * @dev Calculate storage cost for given size
     * @param size File size in bytes
     * @return cost Storage cost in USDFC
     */
    function calculateStorageCost(uint256 size) public view returns (uint256 cost) {
        // Convert bytes to GB and calculate cost
        uint256 sizeInGB = (size * 1e18) / (1e9 * 1e18); // Convert to GB with 18 decimals
        if (sizeInGB == 0) sizeInGB = 1; // Minimum 1 GB
        return sizeInGB * storageFeePerGB;
    }

    /**
     * @dev Get user's files
     * @param user User address
     * @return Array of file IDs
     */
    function getUserFiles(address user) external view returns (bytes32[] memory) {
        return userFiles[user];
    }

    /**
     * @dev Get user balance
     * @param user User address
     * @return balance User's balance
     */
    function getUserBalance(address user) external view returns (uint256 balance) {
        return userBalances[user];
    }

    /**
     * @dev Withdraw user balance
     */
    function withdrawBalance() external nonReentrant {
        uint256 balance = userBalances[msg.sender];
        require(balance > 0, "No balance to withdraw");
        
        userBalances[msg.sender] = 0;
        payable(msg.sender).transfer(balance);
    }

    /**
     * @dev Get contract balance (owner only)
     */
    function getContractBalance() external view onlyOwner returns (uint256) {
        return address(this).balance;
    }

    /**
     * @dev Withdraw contract balance (owner only)
     */
    function withdrawContractBalance() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        
        payable(owner()).transfer(balance);
    }

    /**
     * @dev Get file count
     */
    function getFileCount() external view returns (uint256) {
        return _fileIdCounter.current();
    }

    /**
     * @dev Get bridge count
     */
    function getBridgeCount() external view returns (uint256) {
        return _bridgeIdCounter.current();
    }

    /**
     * @dev Check if file exists
     * @param fileId File ID to check
     */
    function fileExists(bytes32 fileId) external view returns (bool) {
        return files[fileId].owner != address(0);
    }

    /**
     * @dev Get bridge info
     * @param bridgeId Bridge ID
     */
    function getBridgeInfo(bytes32 bridgeId) external view returns (BridgeInfo memory) {
        return bridges[bridgeId];
    }
} 