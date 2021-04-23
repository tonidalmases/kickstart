// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Campaign {
    struct Request {
        string description;
        uint256 value;
        address payable recipient;
        bool complete;
        uint256 approvalsCount;
        mapping(address => bool) approvers;
    }
    struct Summary {
        address manager;
        uint256 minimumContribution;
        uint256 contributorsCount;
        uint256 balance;
        uint256 requestsCount;
    }

    mapping(uint256 => Request) public requests;
    uint256 public requestsCount;

    address public manager;
    uint256 public minimumContribution;

    mapping(address => bool) public contributors;
    uint256 contributorsCount;

    constructor(uint256 minimum, address sender) {
        manager = sender;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(!contributors[msg.sender]);
        require(msg.value >= minimumContribution);

        contributors[msg.sender] = true;
        contributorsCount++;
    }

    function createRequest(
        string memory description,
        uint256 value,
        address payable recipient
    ) public restricted {
        Request storage r = requests[requestsCount++];

        r.description = description;
        r.value = value;
        r.recipient = recipient;
        r.complete = false;
        r.approvalsCount = 0;
    }

    function approveRequest(uint256 index) public {
        Request storage request = requests[index];

        require(contributors[msg.sender]);
        require(!request.approvers[msg.sender]);

        request.approvers[msg.sender] = true;
        request.approvalsCount++;
    }

    function finalizeRequest(uint256 index) public restricted {
        Request storage request = requests[index];

        require(!request.complete);
        require(request.approvalsCount > (contributorsCount / 2));

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns (Summary memory) {
        return
            Summary({
                manager: manager,
                minimumContribution: minimumContribution,
                contributorsCount: contributorsCount,
                balance: address(this).balance,
                requestsCount: requestsCount
            });
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
}
