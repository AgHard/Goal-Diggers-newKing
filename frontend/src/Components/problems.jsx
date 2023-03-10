import React,{ useEffect } from 'react';
import { useState } from 'react';
import courseService from '../courseContainer';
import swal from 'sweetalert';

const Problems = ({status}) => {
    const [ready, setReady] = useState(false);
    const [problems, setProblems] = useState();
    const [reload, setReload] = useState(false);
    useEffect(()=>{
        const getProblems = async () =>{
            setReady(false);
            if (status === 'pendingpro') {
                const res = await courseService.getCoursesProblemsP();
                setProblems(res);
                setReady(true);
            } else if (status === 'resolved') {
                const res = await courseService.getCoursesProblemsR();
                setProblems(res);
                setReady(true);
            } else {
                const res = await courseService.getCoursesProblemsU();
                setProblems(res);
                setReady(true);
            }
        }
        getProblems();
    },[reload, status]);

    const markpending = (e) =>{
        swal({
            title: `Do you really want to Mark these problems as Pending` ,
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then(async (willDelete) => {
            if (willDelete) {
              swal("The problem has been pended", {
                icon: "success",
              });
              const res = await courseService.GrantAccess(e.target.id);
              setReload(!reload);
            }
          });
    }

    const markresolved = (e) =>{
        swal({
            title: `Do you really want to Mark these problem as resolved` ,
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then(async (willDelete) => {
            if (willDelete) {
              swal("Problem has been marked as resolved", {
                icon: "success",
            });
            const res = await courseService.RevokeAccess(e.target.id);
            setReload(!reload);
            }
          });
    }
    return ( 
        <React.Fragment>
        {ready && 
            <React.Fragment>
                <span>Total {problems.length} Problems</span>
                <div className="container mt-3">
                {problems.length === 0 ? <React.Fragment>
                    <img src="./empty-box.png" alt="" className='mt-5' width={'300px'}/>
                </React.Fragment>
                :(problems.map(request => {
                    return <div key={request._id} className="card bg-light m-2">
                        <div className="row">
                            <div className="col-sm-1">
                                <img src="./video.png" alt="" width={'60px'}/>
                            </div>
                            <div className="col-sm-8">
                                <p>{request.studentName} requested to take {request.title} Course</p>
                            </div>
                            {request.status == 'unseen' && 
                            <div className="col-sm-3">
                                <button onClick={(e)=>{markpending(e)}} id={request._id} style={{borderRadius:'25px'}} className='btn btn-info mx-1'>Mark as pending</button>
                                <button onClick={(e)=>{markresolved(e)}} id={request._id} style={{borderRadius:'25px'}}className='btn btn-success'>Mark as resolved</button>
                            </div>
                            }
                            {request.status == 'pendingpro' && 
                            <div className="col-sm-3">
                                    <button onClick={(e)=>{markresolved(e)}} id={request._id} style={{borderRadius:'25px'}}className='btn btn-success'>Mark as resolved</button>                            </div>
                            }
                            {request.status == 'resolved' && 
                            <div className="col-sm-3">
                                <h6 style={{color : 'lightgreen'}}><i className="fa fa-check-circle" aria-hidden="true"></i> Resolved </h6>                           
                            </div>
                            }
                        </div>
                    </div>
                }))
                }
            </div>
            </React.Fragment>
        }
        {!ready && 
                <div  className="container text-center" style={{marginBottom: '300px'}}>
                    <div className="container">
                        <div className="row">
                            <div id="loader">
                                <div className="dot"></div>
                                <div className="dot"></div>
                                <div className="dot"></div>
                                <div className="dot"></div>
                                <div className="dot"></div>
                                <div className="dot"></div>
                                <div className="dot"></div>
                                <div className="dot"></div>
                                <div className="loading"></div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </React.Fragment>
     );
}
 
export default Problems;