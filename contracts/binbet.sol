// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ReentrancyGuard {
    bool private _locked;

    constructor() {
        _locked = false;
    }

    modifier noReentrancy() {
        require(!_locked, "No reentrancy");
        _locked = true;
        _;
        _locked = false;
    }
}

contract BinBet is ReentrancyGuard {
    address public dealer;

    enum TradeType { Buy, Sell }
    struct Trader {
        uint256 volume;
        uint32 timestamp;
        TradeType tradeType;
    }

    mapping(address => Trader) public traders;
    address[] public traderAddresses;
    mapping(TradeType => uint256) public totalVolumes;

    event StakeSubmitted(address indexed trader, uint256 volume, TradeType tradeType, uint32 timestamp);
    event RoundResult(TradeType winningPool, uint256 winningVolume, uint256 losingVolume);
    event Payout(address indexed trader, uint256 payout);

    constructor() {
        dealer = msg.sender;
    }

    modifier onlyDealer() {
        require(msg.sender == dealer, "Only the dealer can call this function.");
        _;
    }

    function submitStake(uint256 volume, bool isBuy) external noReentrancy {
        require(block.timestamp % 60 < 45, "Not within submission time frame.");
        TradeType tradeType = isBuy ? TradeType.Buy : TradeType.Sell;

        traders[msg.sender] = Trader(volume, uint32(block.timestamp), tradeType);
        traderAddresses.push(msg.sender);
        totalVolumes[tradeType] += volume;

        emit StakeSubmitted(msg.sender, volume, tradeType, uint32(block.timestamp));
    }

    function distributeFunds(bool winningPoolIsBuy) external onlyDealer noReentrancy {
        require(block.timestamp % 60 >= 46 && block.timestamp % 60 <= 55, "Not in distribution phase.");

        TradeType winningPool = winningPoolIsBuy ? TradeType.Buy : TradeType.Sell;
        TradeType losingPool = winningPoolIsBuy ? TradeType.Sell : TradeType.Buy;
        uint256 dealerFee = totalVolumes[losingPool] / 10;
        uint256 payoutPool = totalVolumes[losingPool] - dealerFee;

        payable(dealer).transfer(dealerFee);

        for(uint256 i = 0; i < traderAddresses.length; i++) {
            address traderAddress = traderAddresses[i];
            Trader memory trader = traders[traderAddress];
            if(trader.tradeType == winningPool) {
                uint256 traderShare = trader.volume * payoutPool / totalVolumes[winningPool];
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
