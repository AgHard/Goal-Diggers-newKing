const { User, Role, Exam, Course, Instructor, RegisterCourse, CourseRequest, Wallet, Problem} = require('../models/db');
const bcrypt = require("bcrypt");
const _ = require('lodash');
const {ObjectId} = require('mongodb');
const pdf = require('html-pdf');
const {pdfTemplate, certificateTemplate} = require('./generatePDF');
const jwt =require("jsonwebtoken");
require('dotenv').config();
const stripe = require("stripe")(
  "sk_test_51MEsfyD8LuqksnQUfvq6KNmUnIpERtruMHXIKHHnc7EOy51ZdpuYFZ4VlfaIbztSjh7kRZM3OSR0gVIifQjmmhZ1008I0rGA9q"
);

// const transporter = nodemailer.createTransport({
//     service: "Gmail",
//     auth: {
//       user: process.env.username, // generated ethereal user
//       pass: process.env.password, // generated ethereal password
//     },
//   });

//POST 
// url : api/payment/create" Create client secret  


module.exports.createPayment =  async (req, res) => {
  const total = req.body.price;
  console.log(total);
  console.log("Payment Request recieved for this ruppess", total);
  const payment = await stripe.paymentIntents.create({
    amount: total * 100 ,
    currency: "usd",
  });
  res.status(200).json({
    clientSecret: payment.client_secret,
  });
};

//POST 
// url : api/buy-course/ user buy the course need to student id
module.exports.buyCourse =  async (req, res) => {
  let course = req.body.course;
  course.registers ++;
  Course.updateOne({_id : course._id}, course).then();
  course.attemptedQuizs = [];
  course.completedQuizs = 0;
  course.completedVideos = [];
  course.notes = [];
  course.courseID = course._id;
  course = _.omit(course, '_id');
  RegisterCourse.create(course).then(
    result => {
      Wallet.findOne({instructorID : ObjectId(course.createdById)}).then(
        wallet =>{
          if(wallet) {
            wallet.total += course.price*0.7;
            let exist = false;
            wallet.details.forEach((month, index) => {
                if(new Date(month.month).getMonth() === new Date().getMonth() && new Date(month.month).getFullYear() === new Date().getFullYear()) {
                  wallet.details[index].total += course.price*0.7;
                  exist = true;
                }
            });
            if(!exist)
                wallet.details.push({month: `${new Date().getMonth() + 1}-1-${new Date().getFullYear()}`, total : course.price*0.7});
            Wallet.updateOne({_id : wallet._id}, wallet).then();
          }
          else {
            let wallet = {instructorID : ObjectId(course.createdById), total : course.price*0.7, details : [{month: `${new Date().getMonth() + 1}-1-${new Date().getFullYear()}`, total : course.price*0.7}]};
            Wallet.create(wallet).then()
          }
        }
      )
      return res.status(200).json({});
    }
  )
};
// url : api/getinstructor

module.exports.getInstructor = async (req,res) => {
  console.log(req.params.id);
  const id = ObjectId(req.params.id);
  await Instructor.findById(id).then(
      instructor => {
          if(instructor)
              return res.status(200).json({instructor});
          return res.status(404).json({error : "instructor Not Found"});
      }
  )
}


/////GET Num of users
module.exports.getnumusers = async (req,res) => {
  console.log("abdo");
 let users=[0,0,0,0];
 console.log(await Instructor.find({}).count());
 users[0]=await Instructor.find({}).count();
  users[1]=await User.find({}).count();
  users[2]=await Role.find({"role" : "corporatetrainees "}).count();
  users[3]=await Course.find({}).count();
 console.log(users);
 return res.status(200).json({users}); 
}


//GET
// url : /api/get-quiz/12 -> to get quiz
module.exports.getQuiz = async (req,res)=>{
    const quizID = ObjectId(req.params.id);    
    Exam.findById(quizID).then(
        quiz => {
                  res.status(200).json({quiz})
        }
    );
}

//GET
// url : /api/wallet -> to get wallet // need updates
module.exports.getWallet = async (req,res)=>{
    Wallet.findOne({}).then(
      wallet => {
        return res.status(200).json({wallet});
      }
    )
}

//POST
//url : /api/uploadvideos/12 -> to upload the course subtitles
module.exports.uploadVideos = async (req, res) => {
    const courseID = ObjectId(req.params.id);
    const subtitles = req.body; 
    Course.findById(courseID).then(
        course => {
            course.subtitles = subtitles;
            Course.findByIdAndUpdate(courseID, course).then(
                result => {res.status(200).json({})}
            )
        }
    );
};

//POST
//url : /api/uploadpreviewvideo/12 
module.exports.uploadPreviewVideo = async (req, res) => {
    const courseID = req.params.id;
    const video = req.body; 
    Course.findById(courseID).then(
        course => {
            course.overviewVideo = video;
            Course.findByIdAndUpdate(courseID, course).then(
                result => {res.status(200).json({})}
            )
        }
    );
};


//POST 
// url : api/add-course/ 
module.exports.addCourse = async (req, res) => {
  const course = req.body.course;
  course.rate = 0;
  course.ratedetails = [0,0,0,0,0,0];
  course.reviews = [];
  course.numberofrates = 0;
  course.registers = 0;
  course.viewers = 0;
  course.overviewVideo = {title : "Welcome video", url : course.overviewVideo, description : course.summary};
  Course.create(course).then(
    result => {return res.status(200).json({result});}
  )
}

//POST
//url : /api/rate-course/12 -> rate to course
module.exports.addCourseRate = async (req, res) => {
    const courseID = ObjectId(req.params.id);
    const courseRate = Number(req.body.rate);
    const courseReview = req.body.review;
    Course.findById(courseID).then(
        course => {
            course.rate += courseRate;
            course.numberofrates ++;
            course.ratedetails[courseRate] ++;
            // later we add user details for the review
            course.reviews.push(courseReview);
            Course.findByIdAndUpdate(courseID,course).then(
                result => {res.status(200).json({})}
            );
        }
    );
};

//POST
//url : /api/rate-instructor/12 -> rate to instructor
module.exports.addInstructorRate = async (req, res) => {
    const instructorID = ObjectId(req.params.id);
    const instructorRate = Number(req.body.rate);
    const instructorReview = req.body.review;
    Instructor.findById(instructorID).then(
        instructor => {
            instructor.rate += instructorRate;
            instructor.numberofrates ++;
            instructor.ratedetails[instructorRate] ++;
            instructor.reviews.push(instructorReview);
            Instructor.findByIdAndUpdate(instructorID,instructor).then(
                result => {res.status(200).json({});}
            );
        }
    );
};

//POST
//url : /api/add-discount/12 -> instructor add discount
module.exports.addInstructorDiscount = async (req, res) => {
    const courseID = req.params.id;
    const discount = req.body.body;
    Course.findByIdAndUpdate(courseID, {discount : discount}).then(
        course => {
            res.status(200).json({});
        }
    );
};

//GET
//url : /api/reviews-ratings/-> instructor get reviews and ratings
module.exports.getReviewsAndRatings = async (req, res) => {
    const id = ObjectId(req.params.id);
    Instructor.findById(id).then(
        instructor => {
            res.status(200).json({reviews : instructor.reviews, rate : instructor.rate, numberofrates : instructor.numberofrates, ratedetails : instructor.ratedetails});
        }
    )
};
//GET
//url : /api/reviews-ratings/-> course get reviews and ratings
module.exports.getCourseReviewsAndRatings = async (req, res) => {
  const id = ObjectId(req.params.id);
  Course.findById(id).then(
      course => {
          res.status(200).json({reviews : course.reviews, rate : course.rate, numberofrates : course.numberofrates, ratedetails : course.ratedetails});
      }
  )
};
//POST
//url : /api/add-quiz/12 -> add quiz to course
module.exports.addQuiz = async (req, res) => {
    const quiz = req.body.quiz;
    Exam.create(quiz).then(
        result => {return res.status(200).json(result._id)}
    );
};

//GET
//url : /api//verify/12 -> to verify the sent link
module.exports.Linkverify = async (req, res) => {
    try {
      let token = req.params.id;    
      jwt.verify(token, process.env.secretKey, (error, dataLoaded) => {
        if (error) {
          res.status(404).json({});
        } else {
          User.findById(dataLoaded._id).then((user) => {
            if (user) {
              res.status(200).json({});
            } else {
              res.status(404).json({});
            }
          });
        }
      });
    } catch (error) {
      res.status(404).json({});
    }
  };
  
//POST
//url : /api/forgot-password -> verify user email and send reset password link
module.exports.forgotPassword = async (req, res) => {
    let username = req.body.username;
    User.findOne({ username: username }).then(async (user) => {
      if (user) {
        jwt.sign({ _id: user._id }, process.env.secretKey, async (error, token) => {
          if (error) {
            res.status(404).json({});
          } else {
            const url = `http://localhost:3001/reset-password/${token}`;
            await transporter.sendMail(
              {
                from: "examtaking.ms@gmail.com",
                to: user.email,
                subject: "Reset my Password",
                html: `Please click this Link to reset your password <a href="${url}">${url}</a>`,
              },
              (error, info) => {
                if (error) {
                  return res.status(500).json({ error });
                } else {
                  return res.status(200).json({});
                }
              }
            );
          }
        });
      } else {
        res.status(404).json({ error: "email not found" });
      }
    });
  };

// POST
// url : /api/register -> to register user 
// POST
// url : /api/register -> to register user 
module.exports.registerUser = async (req, res) => {
  if(await Role.findOne({ username: req.body.username })) {
      console.log("Sdsdsd");
      return res.status(200).json({ error: "username already exist" });
  }
  if(await Instructor.findOne({ username: req.body.username })) {
      console.log("Sdsdsddsadsadasdsada");
      return res.status(200).json({ error: "username already exist" });
  }
  await User.findOne({ username: req.body.username }).then(async (result) => {
    if (result) {
      console.log("Asda");
      return res.status(200).json({ error: "username already exist" });
    } else {
      try {
        let hashedpassword = await bcrypt.hash(req.body.password, 10);
        let newUser = _.pick(req.body, ["email", "firstname", "lastname","username", "gender"]);
        newUser.password = hashedpassword;
        let user = new User(newUser);
        await user.save(async (error, registeredUser) => {
          if (error) {
            console.log(error);
            res.status(500).json({error});
          } else {
            console.log(registeredUser);
          }
        });
        const token=jwt.sign({user:newUser._id, username : newUser.username},process.env.JWT_SECRET);
        console.log(token);
        res.cookie("token",token,{
          httpOnly:true,
      }).send();
      return;
      
      } catch {
        res.status(500).send();
      }
    }
  });
};


//GET
//url : /api/confirmation/123 -> to confirm user email
module.exports.confirmUser = async (req, res) => {
    try {
      let token = req.params.id;
      jwt.verify(token, process.env.secretKey, async (error, dataLoaded) => {
        User.findById(dataLoaded._id)
          .then((result) => {
            if (result || !result.confirmed) {
              result.confirmed = true;
              User.findOneAndUpdate({ _id: dataLoaded._id }, result, {
                new: true,
              }).then((userCon) => {
                res.status(200).json({});
              });
            } else {
              res.status(404).json({});
            }
          })
          .catch((error) => res.status(404).json({}));
      });
    } catch (error) {
      res.status(404).json({});
    }
  };
  

//POST
// URL : /api/login -> to log user in
module.exports.loginUser = async (req, res) => {
  console.log(req.body);
  let user = _.pick(req.body,['username', 'password']);
  try {
    if(await User.findOne({ username: user.username })){
      User.findOne({ username: user.username })
      .then(async (result) => {
        console.log(result);
          if (await bcrypt.compare(user.password, result.password)) {
            const token=jwt.sign({user:result._id, username : result.username },process.env.JWT_SECRET);
            res.cookie("token",token,{
                httpOnly:true,
            }).send();
                    return;
            } else {
              console.log("fdsfsdfsd");
              res.status(201);
              res.json({ error: "incorrect password" });
              return;
        }
      })
      .catch((error) => {
        res.status(500).json({error});
      });
    }else if(await Instructor.findOne({ username: user.username })){
      Instructor.findOne({ username: user.username })
      .then(async (result) => {
          if (await bcrypt.compare(user.password, result.password)) {
            const token=jwt.sign({user:result._id, username : result.username},process.env.JWT_SECRET);
            res.cookie("token",token,{
                httpOnly:true,
            }).send();
            return;
          } else {
            res.status(201);
            res.json({ error: "incorrect password" });
            return;
          }
      })
      .catch((error) => {
        res.status(500).json({error});
      });

    }else if(Role.findOne({ username: user.username })){
      Role.findOne({ username: user.username })
      .then(async (result) => {
          if (await bcrypt.compare(user.password, result.password)) {
            const token=jwt.sign({user:result._id, username : result.username },process.env.JWT_SECRET);
            res.cookie("token",token,{
                httpOnly:true,
            }).send();
            return;
          } else {
            res.status(201);
            res.json({ error: "incorrect password" });
            return;
          }
      })
      .catch((error) => {
        res.status(500).json({error});
      });
    } else {
      res.status(201);
      res.json({ error: "incorrect username" });
      return;
    }

  } catch (error) {
    res.status(500).json({error});
  }
};

//logout
module.exports.Logout=async(req,res)=>{
  res.cookie("token","",{
    httpOnly:true,
    expires:new Date(0)
}).send();
}

//check loggedin
module.exports.LoggedIn=async(req,res)=>{
  try {
    //we need to parse cookies into javascrip objects
    //using the cookie-parser
    //this is an express middleware that reads any incoming cookies and parse it into req.cookies object
    const token=req.cookies.token;
    let user = {};
    console.log(token);
    if(!token){
        return res.json(false);
    }
    //verifiy the tooken to check if it has our secret and not a random tooken
    //if not verified it will go to the catch and
    //if verified it will decode it and put the tooken value an an object
    //it have the user id
    const verified= jwt.verify(token,process.env.JWT_SECRET);
    if(await User.findById(ObjectId(verified.user))){
      await User.findById(ObjectId(verified.user)).then(
        value => {
          user = value;
          type="student";
        }
      )
    }else if(await Role.findById(verified.user)){
      await Role.findById(verified.user).then(
            value => {
                user = value;
                type = value.role;
            }
      )
    }else if(await Instructor.findById(verified.user)){
      await Instructor.findById(verified.user).then(
        value => {
          user = value;
          type="instructor";
        }
      )
    }
   res.send({id:verified.user,verified:true,type:type, firstname : user.firstname, lastname : user.lastname,
     wallet : user.wallet, email : user.email, gender : user.gender, 
     username : user.username, minibiography : user.minibiography, accepted : user.accepted});
    
} catch (error) {
    console.log(error.message); 
    res.json(false);
}
}
  
// POST
//url : /api/change-password -> to change user password
module.exports.ChangePassword =async (req, res) => {
    let password = req.body.password;
    let password_old = req.body.password_old;
    if (await bcrypt.compare(password_old, req.user.password)) {
      req.user.password = await bcrypt.hash(password, 10);
      User.findOneAndUpdate({ _id: req.user._id }, req.user, {
        new: true,
      }).then();
      res.status(200).json({});
    } else {
      res.status(200).json({ error: "incorrect password" });
    }
};
  
/// need edits
module.exports.changeEmailorBiography = async(req,res)=>{
  const id = ObjectId(req.params.id);
  const data = req.body;
  Instructor.findById(id).then(
    instructor => {
      if(data.email)
        instructor.email=data.email;
      if(data.minibiography)
        instructor.minibiography=data.minibiography;
      Instructor.findByIdAndUpdate(id, instructor).then(
        result => {return res.status(200).json({});}
      )
    }
  )
}

//POST /api/add-user
module.exports.addUser = async (req, res) => {
    const new_user = _.pick(req.body, ['username', 'password', 'role']);
    if(new_user != 'instructor'){
        await Role.findOne({username : new_user.username}).then(
            async user => {
                if(user)
                    return res.status(400).json({error : "Username Already exist"});
                else {
                    new_user.password = await bcrypt.hash(new_user.password, 10);
                    await Role.create(new_user).then(
                        user =>  {return res.status(200).json({user});}
                    )
                }
            }
        )
    }
    else {
        await Instructor.findOne({username : new_user.username}).then(
            async user => {
                if(user)
                    return res.status(400).json({error : "Username Already exist"});
                else {
                    new_user.password = await bcrypt.hash(new_user.password, 10);
                    await Instructor.create(new_user).then(
                        user =>  {return res.status(200).json({user});}
                    )
                }
            }
        )
    }
}


// GET url : /api/all-courses
module.exports.getAllCourses = async (req, res) => {
    await Course.find({}).then(
        courses => {
            return res.status(200).json({courses});
        }
    )
}

// GET url : /api/instructor-courses //need edits
module.exports.getInstructorCourses = async (req, res) => {
    await Course.find({}).then(
        courses => {return res.status(200).json({courses});}
    )
}

// GET url : /api//search/:keyword
module.exports.getSearchCourses = async (req, res) => {
    const keyword = req.params.keyword;
    await Course.find({$or : [{createdByName : { $regex: '.*' + keyword + '.*' }},
        {subject : { $regex: '.*' + keyword + '.*' }},{title : { $regex: '.*' + keyword + '.*' }}]}).then(
            courses => { 
                return res.status(200).json({courses});
            }
    );
}

// GET url : api/course/:id need some edits
module.exports.getCourse = async (req,res) => {
    console.log("req.params.id");
    console.log(req.params.id);
    console.log("req.params.id");
    const id = ObjectId(req.params.id);
    await Course.findById(id).then(
        course => {
          if(course.views) {
            course.views++;
          }
          else
            course.views = 1;
          course.save();
            if(course)
                return res.status(200).json({course});
            return res.status(404).json({error : "Course Not Found"});
        }
    )
}

//POST url : api/save-progress/ save course progress
module.exports.saveProgress = async (req, res) =>{
  const course = req.body.course;
  RegisterCourse.findByIdAndUpdate(course._id, course).then(
    result  => {
                return res.status(200).json({result})}
  );
}

module.exports.saveQuiz = async (req, res) => {
    const grade = Number(req.body.grade);
    const courseID = ObjectId(req.params.courseID);
    const quizID = req.params.id;
    RegisterCourse.findOne({_id:courseID}).then(
      course => {
        let exist = false;
        for (let index = 0; index < course.attemptedQuizs.length; index++) {
            if((course.attemptedQuizs[index].id) === quizID){
              exist = true;
              if(course.attemptedQuizs[index].grade < grade) {
                  if(grade >= 60 && course.attemptedQuizs[index].grade < 60){
                    course.completedQuizs ++;
                  }
                  course.attemptedQuizs[index].grade = grade;
              }
            }
        }
        if(!exist){
          course.attemptedQuizs.push({id:quizID, grade : grade});
        }
        let id = course._id
        RegisterCourse.updateOne({_id : id}, course, {new : true}).then(
          result => { return res.status(200).json({});}
        )
      }
    )
};

//GET url : api/get-registercourses/12 get specific course // need auth
module.exports.getRegisterCourse = async (req, res) =>{
   // get student id from jwt
   const courseID = ObjectId(req.params.id);
   RegisterCourse.findOne({_id : courseID}).then(
    course => {
      if(course){
        res.status(200).json({course});
      }
      else {
        res.status(404).json({error : "YOU DID NOT REGISTER IN THIS COURSE"});
      }
    }
   )
}


module.exports.getNumberOFTrainees = async (req, res) =>{
  try{
    const num = await Role.countDocuments({})
    res.status(200).json({num})
  }
  catch(error){
    res.status(401).json({error})
  }
}

//GET 
// url : api/inprogress-courses/ student get in progress courses // need auth
module.exports.getInProgressCourses = async(req,res) =>{
  RegisterCourse.find({}).then(
      courses =>{
        let result = courses.filter(course=>{return course.totalItems > (course.completedQuizs + course.completedVideos.length)});
        res.status(200).json({courses : result})
      }
  )
};

//GET 
// url : api/completed-courses/ student get completed courses // need auth
module.exports.getCompletedCourses = async(req,res) =>{
  RegisterCourse.find({}).then(
      courses =>{
        let result = courses.filter(course=>{
          return course.totalItems === (course.completedQuizs + course.completedVideos.length);
        });
        res.status(200).json({courses : result})
      }
  )
};

module.exports.getMyCourses = async (req, res) =>{
  try{
    const id = req.params.id;
    const courses = await RegisterCourse.find({studentID:id},{price:0}) // '-price'
    res.status(200).json(courses)
  }
  catch(error){
    res.status(401).json({error})
  }
}
module.exports.getmostviewedcourses = async (req, res) => {
  console.log("mostviewd");
  let mvp=[];
  await Course.find({}).sort({price:-1}).limit(6).then(
      courses => {
          mvp = courses;
      }
  )
  await Course.find({}).sort({price:-1}).limit(6).then(
      courses => {
          return res.status(200).json({courses, mvp});
      }
  )
}

