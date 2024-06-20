import React, {useEffect, useState} from "react";
import {
  Modal,
  ModalBody,
  Form,
} from "reactstrap";
import {
  Icon,
  Col,
  Button,
  RSelect,
} from "../../../components/Component";
import { useForm } from "react-hook-form";
import Select from "react-select";

const EditModal = ({modal,closeModal, formData, setFormData,filterStatus, local, editId, apiClient, singleobj, setModal}) => {
    useEffect(() => {
        reset(formData)
      }, [formData]);
  const {reset, register,  formState: { errors } } = useForm();

  const options = [
    { value: 'Admin', label: 'Admin' },
    { value: 'Editor', label: 'Editor' },
    { value: 'Marketer', label: 'Marketer' }
  ]
  // console.log(singleobj)
  const [firstname, Setfirstname] = useState("")
  const [lastname, Setlastname] = useState("")
  const [username, Setusername] = useState("")
  const [role, Setrole] = useState("")
  const [phone, Setphone] = useState("")
  const [errorfirstname, Seterrorfirstname] = useState("")
  const [errorlastname, Seterrorlastname] = useState("")
  const [erroruser, Seterroruser] = useState("")
  const [errorphone, Seterrorphone] = useState("")
  useEffect(()=>{
    Setfirstname(Object.keys(singleobj).length > 0?singleobj.firstname:"")
    Setlastname(Object.keys(singleobj).length > 0?singleobj.lastname:"")
    Setusername(Object.keys(singleobj).length > 0?singleobj.username:"")
    Setrole(Object.keys(singleobj).length > 0?{ value:singleobj.role, label:singleobj.role }:"")
    Setphone(Object.keys(singleobj).length > 0?singleobj.phone:"")
  },[singleobj])
  const handleEdit = (e)=>{
    e.preventDefault();
    let formData = new FormData();
    formData.append('id', editId)
    formData.append('firstname',  firstname)
    formData.append('lastname',  lastname)
    formData.append('username',  username)
    formData.append('role',  role.value)
    formData.append('phone', phone)
    formData.append('_method', 'put')
    let url = 'api/admin/edituser'
    apiClient.get('/sanctum/csrf-cookie').then(()=>{
      apiClient.post(url, formData, {
        headers:{
          "Authorization":"Bearer "+local.token,
          }
      }).then(res=>{
        if(res.data.message){
          
          setModal({ edit: false }, { add: false });
        }
      }).catch(err=>{
        let error = err.response.data.errors
        if(error.firstname){
          Seterrorfirstname(error.firstname[0])
        }else if(error.lastname){
          Seterrorlastname(error.lastname[0])
        }else if(error.username){
          Seterroruser(error.username[0])
        }else if(error.phone){
          Seterrorphone(error.phone[0])
        }
      })


    })

  }



  return (
            
        <Modal isOpen={modal} toggle={() => closeModal()} className="modal-dialog-centered" size="lg">
          <ModalBody>
            <a
              href="#cancel"
              onClick={(ev) => {
                ev.preventDefault();
                closeModal()
              }}
              className="close"
            >
              <Icon name="cross-sm"></Icon>
            </a>
            <div className="p-2">
              <h5 className="title">Update User</h5>
              <div className="mt-4">
                <Form className="row gy-4" >
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label">Firstname</label>
                      <input
                        className="form-control"
                        type="text"
                        value={firstname}
                        onChange={(e) =>Setfirstname(e.target.value)}
                        placeholder="Enter name" />
                      {errorfirstname && <span className="invalid">{errorfirstname}</span>}
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label">Lastname</label>
                      <input
                        className="form-control"
                        type="text"
                       
                        value={lastname}
                        onChange={(e) =>Setlastname(e.target.value)}
                        placeholder="Enter email" />
                      {errorlastname && <span className="invalid">{errorlastname}</span>}
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label">Username</label>
                      <input
                        className="form-control"
                        type="text"
                          value={username}
                          onChange={(e)=>Setusername(e.target.value)}
                        placeholder="Username" />
                      {erroruser && <span className="invalid">{erroruser}</span>}
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input
                        className="form-control"
                        type="text"
                        value={phone}
                        onChange={(e) =>Setphone(e.target.value)} />
                      {errorphone && <span className="invalid">{errorphone}</span>}
                    </div>
                  </Col>
                  <Col md="12">
                    <div className="form-group">
                      <label className="form-label">Status</label>
                      <div className="form-control-wrap">
                      <div className="form-control-select">
                              <Select options={options} value={role}  onChange={(e)=>Setrole(e)} isMulti={false} classNamePrefix="react-select" className='react-select-container' />
                            </div>
                      </div>
                    </div>
                  </Col>
                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button color="primary" size="md" type="submit" onClick={(e)=>handleEdit(e)}>
                          Update User
                        </Button>
                      </li>
                      <li>
                        <a
                          href="#cancel"
                          onClick={(ev) => {
                            ev.preventDefault();
                            closeModal();
                          }}
                          className="link link-light"
                        >
                          Cancel
                        </a>
                      </li>
                    </ul>
                  </Col>
                </Form>
              </div>
            </div>
          </ModalBody>
        </Modal>
  );
};
export default EditModal;
