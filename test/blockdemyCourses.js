const { expectRevert } = require("@openzeppelin/test-helpers");
const BlockdemyCourse = artifacts.require("BlockdemyCourse.sol");
//const BN = require('bn.js');

contract("Courses", (accounts) => {
  beforeEach(async () => {
    bdemycInstance = await BlockdemyCourse.new();
  });

  it("should mint course", async () => {
    const uris = [
      "fyagygfygfg",
      "fsfsfeef",
      "ddaddwawdd",
      "ffesfeeffefeefs",
      "esffeeffeffe",
      "sffsfsf",
    ];

    await bdemycInstance.mintCourse(accounts[0], uris, 1000, true);
    const bdemyCourses = await bdemycInstance.getAllCourses();

    assert(bdemyCourses.length > 0, "no elements in collection");
    assert(bdemyCourses.length == 1, "wrong number added to collection");
    let Owner = await bdemycInstance.ownerOf(1);
    assert(Owner === accounts[0], "Did not mint to owner");

    assert(bdemyCourses[0].price == 1000, "Did not put correct price");
    assert(bdemyCourses[0].onSale, "Did not put correct sale");
  });

  it("should delete video of a course", async () => {
    const uris = [
      "fyagygfygfg",
      "fsfsfeef",
      "ddaddwawdd",
      "ffesfeeffefeefs",
      "esffeeffeffe",
      "sffsfsf",
    ];

    const uris2 = [
      "fyagygfygfg2",
      "fsfsfeef2",
      "ddaddwawdd2",
      "ffesfeeffefeefs2",
      "esffeeffeffe2",
      "sffsfsf2",
    ];

    const uris3 = [
      "fyagygfygfg3",
      "fsfsfeef3",
      "ddaddwawdd3",
      "ffesfeeffefeefs3",
      "esffeeffeffe3",
      "sffsfsf3",
    ];

    await bdemycInstance.mintCourse(accounts[0], uris, 1000, true);
    await bdemycInstance.mintCourse(accounts[0], uris2, 1000, true);
    await bdemycInstance.mintCourse(accounts[0], uris3, 1000, true);

    await bdemycInstance.deleteVideo(2, "ddaddwawdd2");

    const bdemyCourses = await bdemycInstance.getAllCourses();
    assert(
      bdemyCourses[1].uris.length == 5,
      "should have 5 elements after delete"
    );

    await expectRevert(
      bdemycInstance.deleteVideo(1, "ddaddwawdd2"),
      "non existent hash"
    );
  });

  it("should revert if want to delete non existent video of a course", async () => {
    const uris = [
        "fyagygfygfg",
        "fsfsfeef",
        "ddaddwawdd",
        "ffesfeeffefeefs",
        "esffeeffeffe",
        "sffsfsf",
      ];

      await bdemycInstance.mintCourse(accounts[0], uris, 1000, true);

  
      await expectRevert(
        bdemycInstance.deleteVideo(1, "ddaddwawdd2"),
        "non existent hash"
      );

  });

});
