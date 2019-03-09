const db = firebase.firestore();
const employeesRef = db.collection("employees");

 employeesRef.doc("R.Dikles").set({
    fName: "Ranice", 
    lName: "Dikles", 
    email: "rdikles0@hatena.ne.jp",
    age: 39, 
    gender: 'Female',
    yearsOfExperience: 9,
    isFullTime: true,
});

