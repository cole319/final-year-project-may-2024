const hre = require("hardhat");

async function main() {
  const VotingContract = await hre.ethers.getContractFactory("VotingContract");
  const votingContract = await VotingContract.deploy();

  await votingContract.deployed();

  console.log("Contract deployed at: ", votingContract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
