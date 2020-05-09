var tblhrmdailyrosterattendance = require("../models/tbl_hrm_daily_roster_attendance")
var tblhrmemployeedetails = require("../models/tbl_hrm_employee_details")
var tblemployeedesignations = require("../models/tbl_employee_designations")
var tblemployeedepartments = require("../models/tbl_employee_departments")
var tblhrmemployeeleavetrack = require("../models/tbl_hrm_employee_leave_track")
var tblhrmlogs = require("../models/tbl_hrm_logs")
const sequalize = require("../common/dbconfig").sequelize;
const Sequalize = require("sequelize");




// Find data from multiple tables

exports.userAttendance = (req, res, next) => {
tblhrmdailyrosterattendance = tblhrmdailyrosterattendance(sequalize, Sequalize)
var emp_id=req.body.Emp_Id
tblhrmdailyrosterattendance.findAll({
          offset:(req.body.Page_No-1)*10,limit:10,
          where:{
            emp_id:emp_id
          }

      }).then(a_users => {
          console.log('done attendance');
          tblhrmemployeedetails = tblhrmemployeedetails(sequalize, Sequalize)
          var id=req.body.Emp_Id
          tblhrmemployeedetails.findAll({
            where:{
              id:id
            }
          }).then(l_users =>{
            console.log("****done emp detailes*****");
            tblemployeedesignations = tblemployeedesignations(sequalize, Sequalize)
            tblemployeedesignations.findAll({
              where:{
                id:l_users[0].designation_id
              }
            }).then(deg_users =>{
              console.log("****done degination****")
              tblemployeedepartments = tblemployeedepartments(sequalize, Sequalize)
              tblemployeedepartments.findAll({
                where:{
                  id:l_users[0].department_id
                }
              }).then(dept_users =>{
                console.log("****done department****")
                tblhrmemployeeleavetrack = tblhrmemployeeleavetrack(sequalize, Sequalize)
                id_ltrack=[]
                for(i=0 ;i<10 ; i++){
                  id_ltrack.push(a_users[i].absent_type)
                }
                tblhrmemployeeleavetrack.findAll({
                  where:{
                    id:id_ltrack
                  }
                }).then(ltrack_users =>{
                  console.log("****done leave track****")
                   list=[]
                      for(i=0;i<10;i++){

                      list.push({id:a_users[i].id,emp_id:a_users[i].emp_id,city_id:a_users[i].city_id,date:a_users[i].date,checkin_time:a_users[i].checkin_time,checkout_time:a_users[i].checkout_time,attendance_type:a_users[i].attendance_type,absent_id:a_users[i].absent_type,comments:a_users[i].comments,attendance_id:a_users[i].id,hrm_mode:2,grab_id:l_users[0].grab_id,emp_name:l_users[0].employee_firstname,designation:deg_users[0].designation_name,leave_type:ltrack_users[0].leave_type,status:l_users[0].status,duty_hour:new Date(a_users[i].checkin_time).getHours()-new Date(a_users[i].checkout_time).getHours(),department:dept_users[0].department_name})
                    }
                    res.json(list);
                })
              })
           })
          })
        });

}

//l_users[0].department_id


/*exports.userAttendance = (req, res, next) => {
        tblhrmdailyrosterattendance = tblhrmdailyrosterattendance(sequalize, Sequalize)
        tblhrmdailyrosterattendance.findAll({
          where:{
          emp_id:req.body.Emp_Id
    },
          offset:(req.body.Page_No-1)*20,limit:20,
      }).then(users => {
        list=[]
          for(i=0;i<20;i++){
          list.push({id:users[i].id,emp_id:users[i].emp_id,date:users[i].date,checkin_time:users[i].checkin_time,checkout_time:users[i].checkout_time,attendance_type:users[i].attendance_type,absent_type:users[i].absent_type,comments:users[i].comments,duty_hour:new Date(users[i].checkin_time).getHours()-new Date(users[i].checkout_time).getHours()})

        }
          res.json(list);

        });
}*/
