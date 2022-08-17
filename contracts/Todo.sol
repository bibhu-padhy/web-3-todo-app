// add task function.
// mark as complete function.
// get todos function.
// event for UI to catch

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";

contract TodoTasks {
    struct Task {
        string task;
        uint timestamp;
        address user;
    }

    Task[] Tasks;

    // create

    function saveTask(string calldata _task) public {
        Tasks.push(Task(_task, block.timestamp, msg.sender));
    }

    // get

    function getAllTasks() public view returns (Task[] memory) {
        return Tasks;
    }
}
