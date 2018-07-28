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


it("adding a record", ()=> {
  dbtools.init();
  return dbtools.add("testing", {title: "Ulysses", author: "James Joyce"})
  .then((obj)=> {
    expect(obj).toBeDefined();
  });
}, longTimeout);


it("loads a record", ()=> {
  dbtools.init();
  const id = "WD3pvC1IP2NXWl9RDi5y";
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
    id: "WD3pvC1IP2NXWl9RDi5y" 
  }
  return dbtools.save("/books",book.id, book).then(
    (book)=> {
      expect(book.title).toBeDefined();
    });
});