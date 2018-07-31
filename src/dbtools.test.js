import dbtools from "./dbtools";

const longTimeout = 1000 * 20;

it("make sure tests are running",()=>{
  console.log("dbtools tests load");
});

it("connects to firestore",()=> {
  dbtools.init();
  dbtools.connect().then((con)=>{
    expect(con).toBeDefined();
  });
});

it.only("finds a unique id", ()=> {
  dbtools.init();
  const id = "foo";
  return dbtools.uniqueId("testing", {title: "Ulysses", author: "James Joyce"})
  .then((obj)=> {
    expect(obj).toBe(id);
  });
}, longTimeout);


it("adding a record", ()=> {
  dbtools.init();
  return dbtools.add("testing", {title: "Ulysses", author: "James Joyce"})
  .then((obj)=> {
    expect(obj).toBeDefined();
  });
}, longTimeout);

it("adds a record with its own ID", ()=> {
  dbtools.init();
  const id = "FooBar";
  return dbtools.save("testing", {id: id, title: "Diamond Age", author: "Neil Stephenson"})
  .then((obj)=> {
    expect(obj).toBeDefined();
    expect(obj.id).toBe(id);
  });
}, longTimeout);


it("loads a record", ()=> {
  dbtools.init();
  const id = "FooBar";
  return dbtools.get("/books",id).then(
    (book)=> {
      expect(book.title).toBeDefined();
      console.log("book", book);
    });
});

it("saved a record", ()=> {
  dbtools.init();
  let book = { 
    author: "", 
    created: new Date("2018-07-10T00:31:08.083Z"),
    desc: "bar", 
    modified: new Date("2018-07-10T00:31:08.083Z"), 
    title: "zzzz",
    id: "FooBar" 
  }
  return dbtools.save("/books", book).then(
    (book)=> {
      expect(book.title).toBeDefined();
    });
});