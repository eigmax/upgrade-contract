// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers, upgrades } from "hardhat"


async function main() {
   const Box = await ethers.getContractFactory("Box")
  console.log("Deploying Box...")
  const box = await upgrades.deployProxy(Box,[42], { initializer: 'store' })

  console.log(box.address," box(proxy) address")
  console.log(await upgrades.erc1967.getImplementationAddress(box.address)," getImplementationAddress")
  console.log(await upgrades.erc1967.getAdminAddress(box.address)," getAdminAddress")
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
