
$(document ).ready(function() {
    LoadData();
    //get all the data on app startup
    $('#createEmployee').click(function(){
        $('.employeeForm').css("display", "block");
        $('#dynamicBtn').text('Save Changes')
    });

    $('#dynamicBtn').click(function(){
        //employee form values
        let fname = $("#fname").val();
        let lname = $("#lname").val();
        let email = $("#email").val();
        let age = $("#age").val();
        let gender = $("#gender").val();
        let yearsOfExperience = $("#yearsOfExperience").val();
        let isfulltime = $('#isFullTime').is(":checked")

        //check if you need to create or update an employee
        if($(this).text() == "Save Changes"){
            
            let docuName = fname.charAt(0)+"."+lname;
            db.collection("employees").doc(docuName).set({
                fName:fname,
                lName: lname,
                email: email,
                age: age,
                gender: gender,
                yearsOfExperience: yearsOfExperience,
                isFullTime: isfulltime
            })
            .then(function(docRef) {
                 $('#operationStatus').html('<div class="alert alert-success"><strong>Success!</strong> Employee was created!</div>').delay(2500).fadeOut('slow');
                 $('.employeeForm').css("display", "none");
                 LoadData();
            })
            .catch(function(error) {
                $('#operationStatus').html('<div class="alert alert-danger"><strong>Error!</strong> Employee was not created!</div>').delay(2500).fadeOut('slow');
            });
        }
        else{
          
            let docuName = fname.charAt(0)+"."+lname;
            let sfDocRef = db.collection("employees").doc(docuName);
            sfDocRef.set({ 
                fName,
                lName,
                email,
                age,
                gender,
                yearsOfExperience,
                isFullTime: isfulltime
            })
            .then(function() {
                $('#operationStatus').html('<div class="alert alert-success"><strong>Success!</strong> Employee was updated.</div>').delay(2500).fadeOut('slow');
                $('.employeeForm').css("display", "none");
                LoadData();
            })
            .catch(function(error) {
                $('#operationStatus').html('<div class="alert alert-danger"><strong>Failure!</strong> Employee could not be updated.</div>').delay(2500).fadeOut('slow');
            });
        }
    });

    // Cancel the Employee form
    $('#cancel').click(function(){
        $('.employeeForm').css("display", "none");
    });

    // Get the data of the employee you want to edit
    $("tbody.tbodyData").on("click","td.editEmployee", function(){
        $('.employeeForm').css("display", "block");
        $('#dynamicBtn').text('Update Employee');

        $("#fname").val($(this).closest('tr').find('.fname').text());
        $("#lname").val($(this).closest('tr').find('.lname').text());
        $("#email").val($(this).closest('tr').find('.email').text());
        $("#age").val($(this).closest('tr').find('.age').text());
        $("#gender").val($(this).closest('tr').find('.gender').text());
        $("#yearsOfExperience").val($(this).closest('tr').find('.yearsofexperience').text());
        $("#isFullTime").prop('checked', $(this).closest('tr').find('.isfulltime').text() === 'true');
    });

    // Delete employee
    $("tbody.tbodyData").on("click","td.deleteEmployee", function(){

        //Get the Employee Data
        let fName = $(this).closest('tr').find('.fname').text(); //First Name
        let lName = $(this).closest('tr').find('.lname').text(); //Last Name

        let docuName = fName.charAt(0)+"."+lName;
        db.collection("employees").doc(docuName).delete().then(function() {
            $('#operationStatus').html('<div class="alert alert-success"><strong>Success!</strong> Employee was deleted.</div>').delay(2500).fadeOut('slow');
            LoadData();
        }).catch(function(error) {
            $('#operationStatus').html('<div class="alert alert-danger"><strong>Failure!</strong> Employee was not deleted.</div>').delay(2500).fadeOut('slow');
        });
    });

    $("#searchEmployee" ).change(function() {
        console.log('You entered: ', $(this).val());
        //Get the Employee Data
        let searchValue = $(this).val()
        employeesRef.where("fName", "==", searchValue)
        .onSnapshot(function(querySnapshot) {
            LoadTableData(querySnapshot)
        });
      });



      function LoadData(){
        employeesRef.get().then(function(querySnapshot) {
            LoadTableData(querySnapshot)
        });
      }

      function LoadTableData(querySnapshot){
        let tableRow='';
        querySnapshot.forEach(function(doc) {
            let document = doc.data();
            tableRow +='<tr>';
            tableRow += '<td class="fname">' + document.fName + '</td>';
            tableRow += '<td class="lname">' + document.lName + '</td>';
            tableRow += '<td class="email">' + document.email + '</td>';
            tableRow += '<td class="age">' + document.age + '</td>';
            tableRow += '<td class="gender">' + document.gender + '</td>';
            tableRow += '<td class="yearsofexperience">' + document.yearsOfExperience + '</td>';
            tableRow += '<td class="isfulltime">' + document.isFullTime + '</td>';
            tableRow += '<td class="editEmployee"><i class="fa fa-pencil" aria-hidden="true" style="color:green"></i></td>'
            tableRow += '<td class="deleteEmployee"><i class="fa fa-trash" aria-hidden="true" style="color:red"></i></td>'
            tableRow += '</tr>';
        });
        $('tbody.tbodyData').html(tableRow);
      }
});
