// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract WebsiteTemplateMarketplace is ERC721URIStorage {  
  using Counters for Counters.Counter;
  Counters.Counter public templateIds;

  mapping(uint => Template) public listOfTemplate;

  struct Template {
    uint tokenId;
    string cid;
    bool isBrought;
    address owner;
  }

  event TemplateCreated (
    uint tokenId,
    string cid,
    address owner
  );

  constructor() ERC721("Website Template NFT", "WTM") {}

  function createTemplate(string memory _cid) public payable returns (uint) {
    templateIds.increment();
    uint256 newTemplateId = templateIds.current();

    listOfTemplate[newTemplateId] = Template(newTemplateId, _cid, false, msg.sender);
    emit TemplateCreated(newTemplateId, _cid, msg.sender);

    return newTemplateId;
  }

  function mintTemplate(uint _id) public payable returns (uint) {
    Template memory _template = listOfTemplate[_id];

    _mint(msg.sender, _template.tokenId);
    _setTokenURI(_template.tokenId, _template.cid);

    return _template.tokenId;
  }
}