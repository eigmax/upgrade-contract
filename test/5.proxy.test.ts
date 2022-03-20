import { expect } from "chai";
import { ethers, waffle } from "hardhat"
import { Contract, BigNumber } from "ethers"

const provider = waffle.provider

describe("Proxy", function () {
  let pro:Contract;
  let v1: Contract;
  let v2: Contract;

  beforeEach(async function () {
    const Pro = await ethers.getContractFactory("Proxy")
    pro = await Pro.deploy()
    await pro.deployed()

    const V1 = await ethers.getContractFactory("V1")
    v1 = await V1.deploy()
    await v1.deployed()
    await pro.setImplementation(v1.address)

    const abi = ["function initialize() public"];
    const proxied = new ethers.Contract(pro.address, abi, provider.getSigner(0));
    await proxied.initialize();

    const V2 = await ethers.getContractFactory("Proxy")
    v2 = await V2.deploy()
    await v2.deployed()
  })

  it("should retrieve value previously stored", async function () {
    await v1.inc()
    expect(await v1.x()).to.equal(BigNumber.from('1'))

    await pro.setImplementation(v2.address)
    const abi = ["function inc() public", "function dec() public", "function x() public returns(uint)"];
    const proxied = new ethers.Contract(pro.address, abi, provider.getSigner(0));

    expect(await proxied.x()).to.equal(BigNumber.from('1'))
    proxied.dec()
    expect(await proxied.x()).to.equal(BigNumber.from('0'))
  })
})
