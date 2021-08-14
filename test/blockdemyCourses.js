const { expectRevert } = require("@openzeppelin/test-helpers");
const BlockdemyCourse = artifacts.require("BlockdemyCourse.sol");
//const BN = require('bn.js');

contract("Courses", (accounts) => {
  beforeEach(async () => {
    bdemycInstance = await BlockdemyCourse.new();
  });

  it("should mint course", async () => {
    let title = "course 1";
    let description = "description of course 1";

    const uris = [];

    await bdemycInstance.mintCourse(
      accounts[0],
      title,
      description,
      uris,
      1000,
      true
    );
    const bdemyCourses = await bdemycInstance.getAllCourses();

    assert(bdemyCourses.length > 0, "no elements in collection");
    assert(bdemyCourses.length == 1, "wrong number added to collection");
    let Owner = await bdemycInstance.ownerOf(1);
    assert(Owner === accounts[0], "Did not mint to owner");

    assert(bdemyCourses[0].price == 1000, "Did not put correct price");
    assert(bdemyCourses[0].onSale, "Did not put correct sale");
    console.log(bdemyCourses[0].uris)
  });

  it("should delete video of a course", async () => {
    let title = "course 1";
    let description = "description of course 1";

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

    await bdemycInstance.mintCourse(
      accounts[0],
      title,
      description,
      uris,
      1000,
      true
    );
    await bdemycInstance.mintCourse(
      accounts[0],
      title,
      description,
      uris2,
      1000,
      true
    );
    await bdemycInstance.mintCourse(
      accounts[0],
      title,
      description,
      uris3,
      1000,
      true
    );

    await bdemycInstance.deleteUri(2, "ddaddwawdd2");

    const bdemyCourses = await bdemycInstance.getAllCourses();
    assert(
      bdemyCourses[1].uris.length == 5,
      "should have 5 elements after delete"
    );

    await expectRevert(
      bdemycInstance.deleteUri(1, "ddaddwawdd2"),
      "non existent hash"
    );
  });

  it("should revert if want to delete non existent video of a course", async () => {
    let title = "course 1";
    let description = "description of course 1";

    const uris = [
      "fyagygfygfg",
      "fsfsfeef",
      "ddaddwawdd",
      "ffesfeeffefeefs",
      "esffeeffeffe",
      "sffsfsf",
    ];

    await bdemycInstance.mintCourse(
      accounts[0],
      title,
      description,
      uris,
      1000,
      true
    );

    await expectRevert(
      bdemycInstance.deleteUri(1, "ddaddwawdd2"),
      "non existent hash"
    );
  });

  it("should get a course by its id", async () => {
    let title = "course 1";
    let description = "description of course 1";

    let title2 = "course 2";
    let description2 = "description of course 2";

    let title3 = "course 3";
    let description3 = "description of course 3";

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

    await bdemycInstance.mintCourse(
      accounts[0],
      title,
      description,
      uris,
      1000,
      true
    );
    await bdemycInstance.mintCourse(
      accounts[0],
      title2,
      description2,
      uris2,
      2000,
      true
    );
    await bdemycInstance.mintCourse(
      accounts[0],
      title3,
      description3,
      uris3,
      3000,
      true
    );

    const bdemyCourse1 = await bdemycInstance.getCourseById(1);

    assert(
      bdemyCourse1.uris.length == 6,
      "wrong number of videos uri retreived"
    );
    assert(bdemyCourse1.title == title, "wrong title retreived");
    assert(
      bdemyCourse1.description == description,
      "wrong description retreived"
    );
    assert(bdemyCourse1.price == 1000, "wrong 1000 retreived");
    assert(bdemyCourse1.onSale, "wrong onSale retreived");
  });


  it("should add video to course course", async () => {
    let title = "course 1";
    let description = "description of course 1";

    const uris = [
      "fyagygfygfg",
      "fsfsfeef",
      "ddaddwawdd",
      "ffesfeeffefeefs",
      "esffeeffeffe",
      "sffsfsf",
    ];

    await bdemycInstance.mintCourse(
      accounts[0],
      title,
      description,
      uris,
      1000,
      true
    );

    await bdemycInstance.addTokenUris(1,['new video uri']);

    const bdemyCourse1 = await bdemycInstance.getCourseById(1);

    assert(
      bdemyCourse1.uris.length == 7,
      "wrong number of videos"
    );



  });

  it.only("should put on sale", async () => {
    let title = "course 1";
    let description = "description of course 1";

    const uris = [];

    await bdemycInstance.mintCourse(
      accounts[0],
      title,
      description,
      uris,
      1000,
      true
    );
    
    //set course on sale with 1000usd of value
    await bdemycInstance.setOnSale(1,1000);

    
    const bdemyCourse = await bdemycInstance.getCourseById(1);  


    assert(bdemyCourse.onSale,'Did not change onSale state');
    assert(bdemyCourse.price,'Did not change price state');
    
  });


});
