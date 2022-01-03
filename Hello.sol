// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract Hello {
    string message;

    constructor() {
        message = "Hello, Shaner! It is really time to go...";
    }

    function setMessage(string memory _message) public {
        message = _message;
    }

    function getMessage() public view returns (string memory) {
        return message;
    }
}