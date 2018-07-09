import dbtools from "./dbtools";

const longTimeout = 1000 * 20;

it("make sure tests are running",()=>{
  console.log("it tests");
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

