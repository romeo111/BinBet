// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract BinBet is AccessControl, ReentrancyGuard {
    bytes32 public constant DEALER_ROLE = keccak256("DEALER_ROLE");

    enum TradeType { Buy, Sell }
    struct Trader {
        uint256 volume;
        uint32 timestamp;
        TradeType tradeType;
        string userID; // Changed from dealerID to userID
    }

    mapping(address => Trader) public traders;
    address[] public traderAddresses;
    mapping(TradeType => uint256) public totalVolumes;

    event StakeSubmitted(address indexed trader, uint256 volume, TradeType tradeType, uint32 timestamp);
    event RoundResult(TradeType winningPool, uint256 winningVolume, uint256 losingVolume);
    event Payout(address indexed trader, uint256 payout);

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(DEALER_ROLE, msg.sender);
    }

    modifier onlyDealer() {
        require(hasRole(DEALER_ROLE, msg.sender), "Caller is not a dealer");
        _;
    }

    function addDealer(address dealer) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(dealer != address(0), "Invalid dealer address");
        grantRole(DEALER_ROLE, dealer);
    }

    function submitStake(uint256 volume, bool isBuy, string memory userID) external noReentrancy {
        require(volume > 0, "Volume must be greater than 0");
        require(bytes(userID).length > 0, "User ID is required");
        require(block.timestamp % 60 < 45, "Not within submission time frame.");

        TradeType tradeType = isBuy ? TradeType.Buy : TradeType.Sell;

        // Checks
        require(totalVolumes[tradeType] + volume <= address(this).balance, "Insufficient contract balance");

        // Effects
        traders[msg.sender] = Trader(volume, uint32(block.timestamp), tradeType, userID);
        traderAddresses.push(msg.sender);
        totalVolumes[tradeType] += volume;

        // Interaction
        emit StakeSubmitted(msg.sender, volume, tradeType, uint32(block.timestamp));
    }

    function distributeFunds(bool winningPoolIsBuy) external onlyDealer noReentrancy {
        require(block.timestamp % 60 >= 46 && block.timestamp % 60 <= 55, "Not in distribution phase.");

        TradeType winningPool = winningPoolIsBuy ? TradeType.Buy : TradeType.Sell;
        TradeType losingPool = winningPoolIsBuy ? TradeType.Sell : TradeType.Buy;

        // Checks
        uint256 dealerFee = totalVolumes[losingPool] / 10;
        uint256 payoutPool = totalVolumes[losingPool] - dealerFee;
        require(payoutPool <= address(this).balance, "Insufficient contract balance for payouts");

        // Effects
        payable(msg.sender).transfer(dealerFee); // Distributing dealer fee
        
        for(uint256 i = 0; i < traderAddresses.length; i++) {
            address traderAddress = traderAddresses[i];
            Trader memory trader = traders[traderAddress];
            if(trader.tradeType == winningPool) {
                uint256 traderShare = trader.volume * payoutPool / totalVolumes[winningPool];
                // Interaction
                payable(traderAddress).transfer(traderShare);
                emit Payout(traderAddress, traderShare);
            }
        }

        emit RoundResult(winningPool, totalVolumes[winningPool], totalVolumes[losingPool]);

        resetGame();
    }

    function resetGame() private {
        for(uint256 i = 0; i < traderAddresses.length; i++) {
            delete traders[traderAddresses[i]];
        }
        delete traderAddresses;
        totalVolumes[TradeType.Buy] = 0;
        totalVolumes[TradeType.Sell] = 0;
    }

    receive() external payable {}
    fallback() external payable {}
}
