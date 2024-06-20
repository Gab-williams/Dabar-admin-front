import React, { useEffect, useState } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import {
  Block,
  BlockBetween,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  BlockDes,
  Col,
  Row,
  Icon,
  Button,
  PaginationComponent,
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableRow,
  PreviewCard,
  DataTableItem,
} from "../../../components/Component";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  DropdownItem,
  Badge,
  Modal,
  ModalBody,
  ModalFooter,
  Spinner
} from "reactstrap";

import { categories } from "./data/category";
import axios from "axios";
import Select from "react-select";
import { AES, enc } from "crypto-js";
import ReactPaginate from "react-paginate";

const DocumentVideos = () => {
  const [data, setData] = useState(categories);

  const [tablesm, updateTableSm] = useState(false);
  const [onSearch, setonSearch] = useState(true);
  const [onSearchText, setSearchText] = useState("");
  const [catedata, Setcatedata] = useState([]);
  const [actionText, setActionText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [sort, setSortState] = useState("");
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalFail, setModalFail] = useState(false);
  const toggleSuccess = () => setModalSuccess(!modalSuccess);
  const toggleModalFail = () => setModalFail(!modalFail);
  const [writerdata, Setwriterdata] = useState([])
  const [categorydata, Setcategorydata] = useState([])
  const [loading, setLoading] = useState(false);

  // Sorting data
  const sortFunc = (params) => {
    let defaultData = data;
    if (params === "asc") {
      let sortedData = defaultData.sort((a, b) => a.name.localeCompare(b.name));
      setData([...sortedData]);
    } else if (params === "dsc") {
      let sortedData = defaultData.sort((a, b) => b.name.localeCompare(a.name));
      setData([...sortedData]);
    }
  };

  // unselects the data on mount
  useEffect(() => {
    let newData;
    newData = categories.map((item) => {
      item.checked = false;
      return item;
    });
    setData([...newData]);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Changing state value when searching name
  useEffect(() => {
    if (onSearchText !== "") {
      const filteredObject = categories.filter((item) => {
        return (
          item.name.toLowerCase().includes(onSearchText.toLowerCase()) ||
          item.type.toLowerCase().includes(onSearchText.toLowerCase())
        );
      });
      setData([...filteredObject]);
    } else {
      setData([...categories]);
    }
  }, [onSearchText, setData]);

  // function to set the action to be taken in table header
  const onActionText = (e) => {
    setActionText(e.value);
  };

  // onChange function for searching name
  const onFilterChange = (e) => {
    setSearchText(e.target.value);
  };

  // function to toggle the search option
  const toggle = () => setonSearch(!onSearch);

  // Get current list, pagination
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const [last, Setlast] = useState(1);
  const [message, Setmessage] = useState("");
  let local = localStorage.getItem("thedabar")
    ? JSON.parse(
        AES.decrypt(localStorage.getItem("thedabar"), "TheDabar").toString(
          enc.Utf8
        )
      )
    : {};
  let original = window.location.origin;
  const apiClient = axios.create({
    baseURL: "https://dabarmedia.com/",
    withCredentials: true,
  });

  useEffect(() => {
    apiClient.get("/sanctum/csrf-cookie").then(async () => {
      let urlxx = "api/admin/adminvideos";
      let res = await apiClient.get(urlxx, {
        headers: {
          Authorization: "Bearer " + local.token,
        },
      });
      if (res.data.success) {
        console.log(res);
        Setcatedata(res.data.message.data);
        Setlast(res.data.message.last_page);
      }
    });

 

    //   const checkupdatex = async()=>{
    //     let urlzxs = '/api/updatestories';
    //     await  apiClient.get('/sanctum/csrf-cookie')
    //       let headers = new Headers();
    //      headers.append('Content-Type', 'application/json')
    //      let checkupdate =  await  apiClient.get(urlzxs,headers)
    // }
    // const min = 60 * 1000
    // const inteval = setInterval(()=>{
    //   checkupdatex()
    // },min)
    //  return clearInterval(()=>inteval)
    let url = 'api/admin/storydatalist'
    apiClient.get('/sanctum/csrf-cookie').then(()=>{
      apiClient.get(url,   {
        headers:{
          "Authorization":"Bearer "+local.token,
          }
      }).then(res=>{
        if(res.data.message){
           let answriter =   res.data.message.writer.map((item)=>{
            return {id:item.id, value:item.name, label:item.name}
           })
           Setwriterdata(answriter)
           let anscategory = res.data.message.category.map((item)=>{
            return {id:item.id, value:item.name, label:item.name}
           })
           Setcategorydata(anscategory)
        }
      })
    })


  }, []);
  const navigate = useNavigate();
  const handleDelete = (e, id) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("id", id);
    formData.append("_method", "DELETE");
    let urlxs = "api/admin/deletevideo";
    apiClient.get("/sanctum/csrf-cookie").then(() => {
      apiClient
        .post(urlxs, formData, {
          headers: {
            Authorization: "Bearer " + local.token,
          },
        })
        .then((res) => {
          if (res.data.message) {
            Setmessage(res.data.message);
            setModalSuccess(true);
            setTimeout(() => {
              window.location.href = original + "/demo9/copywriter";
            }, 3000);
          }
        });
    });
  };

  const Imagekitupload = async (data) => {
    try {
      let local = localStorage.getItem("thedabar")
        ? JSON.parse(
            AES.decrypt(localStorage.getItem("thedabar"), "TheDabar").toString(
              enc.Utf8
            )
          )
        : {};

      // Ensure CSRF cookie is set
      await apiClient.get("/sanctum/csrf-cookie");

      let urlxx = "/api/admin/uploadauth";
      let response = await apiClient.get(urlxx, {
        headers: {
          Authorization: "Bearer " + local.token,
        },
      });

      if (response.data.success) {
        let filename = "Dabar";
        var formData = new FormData();
        formData.append("file", data);
        formData.append("fileName", filename);
        // tega public key for image kit: public_Wl9bE4KPg58H6+uWmt7exPKW+Wc=
        formData.append("publicKey", "public_Wl9bE4KPg58H6+uWmt7exPKW+Wc=");
        formData.append("signature", response.data.success.signature || "");
        formData.append("expire", response.data.success.expire || 0);
        formData.append("token", response.data.success.token);

        let urlxc = "https://upload.imagekit.io/api/v1/files/upload";
        let fetchResponse = await fetch(urlxc, {
          method: "POST",
          body: formData,
        });

        if (fetchResponse.ok) {
          const responseData = await fetchResponse.json();
          return responseData.url;
        } else {
          console.error("Image upload failed:", fetchResponse.statusText);
          // Handle error as needed
          return null;
        }
      } else {
        console.error(
          "Failed to get upload authorization:",
          response.statusText
        );
        // Handle error as needed
        return null;
      }
    } catch (error) {
      console.error("An error occurred:", error);
      // Handle error as needed
      return null;
    }
  };
const [isEditnum, SetisEditnum] = useState("")
  const handleEdit = (e, id) => {
    e.preventDefault();
    console.log(e.target, id);
    SetisEditnum(id)
  };

  const handleNext = (ans) => {
    let Answer = ans.selected + 1;
    let url = `api/admin/adminvideos?number=${Answer}`;
    apiClient.get("/sanctum/csrf-cookie").then(() => {
      apiClient
        .get(url, {
          headers: {
            Authorization: "Bearer " + local.token,
          },
        })
        .then((res) => {
          if (res.data.success) {
            Setcatedata(res.data.message.data);
          }
        });
    });
  };
  const [name, Setname] = useState("");
  const [hypeurl, SetHypeurl] = useState("");
  const [file, SetFile] = useState("");
  const [editfile, Seteditfile] = useState("")
  const [category, setCategory] = useState("");
  const [writername, setWritername] = useState("")
  const handleCategories = async (e) => {
    e.preventDefault();
    setLoading(true)
    if (file) {
      let fileawait = await Imagekitupload(file);
      let formData = new FormData();
      formData.append("title", name);
      formData.append("url", hypeurl);
      formData.append("file", fileawait);
      formData.append("category", category.value);
      formData.append("writername", writername);
      let url = `api/admin/videocreate`;
      apiClient.get("/sanctum/csrf-cookie").then(() => {
        apiClient
          .post(url, formData, {
            headers: {
              Authorization: "Bearer " + local.token,
            },
          })
          .then((res) => {
            console.log(res);
            // Setmessage
            if (res.data.success) {
              setLoading(false)
              Setmessage(res.data.success);
              setModalSuccess(true);
              setTimeout(() => {
                window.location.href =
                  original + "/demo9/copywriter/document-videos";
              }, 3000);
            } else {
              Setmessage(res.data.error);
              setModalFail(true);
              setLoading(false)

            }
          })
          .catch((err) => {
            let error = err.response.data.errors;
            if (error.name) {
              Setmessage(error.name[0]);
              setModalFail(true);
              setLoading(false)

            }
          })
      });
    } else {
      Setmessage("please insert the correct data");
      setModalFail(true);
    }
  };

  useEffect(()=>{
    let editcata =  catedata.find((item)=>item.id == isEditnum)
    // console.log(isEditnum, editcata)
    if(isEditnum){
      Setname(editcata.title)
      SetHypeurl(editcata.url)
      Seteditfile(editcata.file)
       let collectcatedata =  categorydata.find((item)=>item.value == editcata.category)
       setCategory(collectcatedata)
      setWritername(editcata.writername)
    }

   },[isEditnum])




  const handleWriter=(writername)=>{
    setWritername(writername)
    // const selectedValue = writerword ? writerword.value : null;
    // let info = writerdata.find((item)=>item.value == selectedValue) 
  }

  const handleCate = (category)=>{
    setCategory(category)
  }

  const handleEditBtn = async(e)=>{
    e.preventDefault();
    setLoading(true)
    if (file) {
      let fileawait = await Imagekitupload(file);
      let formData = new FormData();
      formData.append("id", isEditnum);
      formData.append("title", name);
      formData.append("url", hypeurl);
      formData.append("file", fileawait);
      formData.append("category", category.value);
      formData.append("writername", writername);
      formData.append("_method", "put")
      let url = `api/admin/updatevideo`;
      apiClient.get("/sanctum/csrf-cookie").then(() => {
        apiClient
          .post(url, formData, {
            headers: {
              Authorization: "Bearer " + local.token,
            },
          })
          .then((res) => {
            // Setmessage
            if (res.data.success) {
              setLoading(false)
              Setmessage(res.data.success);
              setModalSuccess(true);
              setTimeout(() => {
                window.location.href =
                  original + "/demo9/copywriter/document-videos";
              }, 3000);
            } else {
              Setmessage(res.data.error);
              setModalFail(true);
              setLoading(false)

            }
          })
          .catch((err) => {
            let error = err.response.data.errors;
            if (error.name) {
              Setmessage(error.name[0]);
              setModalFail(true);
              setLoading(false)

            }
          })
      });
    } else {
      let formData = new FormData();
      formData.append("id", isEditnum);
      formData.append("title", name);
      formData.append("url", hypeurl);
      formData.append("file", editfile);
      formData.append("category", category.value);
      formData.append("writername", writername);
      formData.append("_method", "put")
      let url = `api/admin/updatevideo`;
      apiClient.get("/sanctum/csrf-cookie").then(() => {
        apiClient
          .post(url, formData, {
            headers: {
              Authorization: "Bearer " + local.token,
            },
          })
          .then((res) => {
            console.log(res);
            // Setmessage
            if (res.data.success) {
              setLoading(false)
              Setmessage(res.data.success);
              setModalSuccess(true);
              setTimeout(() => {
                window.location.href =
                  original + "/demo9/copywriter/document-videos";
              }, 3000);
            } else {
              Setmessage(res.data.error);
              setModalFail(true);
              setLoading(false)

            }
          })
          .catch((err) => {
            let error = err.response.data.errors;
            if (error.name) {
              Setmessage(error.name[0]);
              setModalFail(true);
              setLoading(false)

            }
          })
      });
    }
  }

  return (
    <React.Fragment>
      <Head title="Categories"></Head>
      <Content>
        <BlockHead size="lg">
          <div className="nk-block-head-sub">
            <span></span>
          </div>
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle className="page-title">
                Document Categories
              </BlockTitle>
              <BlockDes>
                <p>Add Document Categories here.</p>
              </BlockDes>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block>
          <DataTable className="card-stretch">
            <div className="card-inner position-relative card-tools-toggle">
              <div className="card-title-group">
                <div className="card-title">
                  <h5 className="title">Categories</h5>
                </div>
                <div className="card-tools me-n1">
                  <ul className="btn-toolbar gx-1">
                    {/* <li>
                      <a
                        href="#search"
                        onClick={(ev) => {
                          ev.preventDefault();
                          toggle();
                        }}
                        className="btn btn-icon search-toggle toggle-search"
                      >
                        <Icon name="search"></Icon>
                      </a>
                    </li> */}
                    <li className="btn-toolbar-sep"></li>
                    <li>
                      <UncontrolledDropdown>
                        <DropdownToggle
                          tag="a"
                          className="btn btn-trigger btn-icon dropdown-toggle"
                        >
                          <div className="dot dot-primary"></div>
                          <Icon name="filter-alt"></Icon>
                        </DropdownToggle>
                        <DropdownMenu end style={{ overflow: "visible" }}>
                          <div className="dropdown-content">
                            <ul className="link-check">
                              <li>
                                <a href="#">
                                  <Icon name="calendar-check"></Icon>
                                  <span>Date Created</span>
                                </a>
                              </li>
                              <li className="active">
                                <a href="#">
                                  <Icon name="edit"></Icon>
                                  <span>Last Modified</span>
                                </a>
                              </li>
                              <li>
                                <a href="#">
                                  <Icon name="text-a"></Icon>
                                  <span>Alphabetical</span>
                                </a>
                              </li>
                            </ul>
                          </div>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </li>
                  </ul>
                </div>
              </div>
              <div
                className={`card-search search-wrap ${!onSearch && "active"}`}
              >
                <div className="card-body">
                  <div className="search-content">
                    <Button
                      className="search-back btn-icon toggle-search active"
                      onClick={() => {
                        setSearchText("");
                        toggle();
                      }}
                    >
                      <Icon name="arrow-left"></Icon>
                    </Button>
                    <input
                      type="text"
                      className="border-transparent form-focus-none form-control"
                      placeholder="Search by user or email"
                      value={onSearchText}
                      onChange={(e) => onFilterChange(e)}
                    />
                    <Button className="search-submit btn-icon">
                      <Icon name="search"></Icon>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <DataTableBody>
              <DataTableHead>
                <DataTableRow>
                  <h6 className="overline-title">Title</h6>
                </DataTableRow>
                <DataTableRow>
                  <h6 className="overline-title">url</h6>
                </DataTableRow>
                <DataTableRow>
                  <h6 className="overline-title">file</h6>
                </DataTableRow>
                <DataTableRow size="md">
                  <h6 className="overline-title">Last Modified</h6>
                </DataTableRow>
                <DataTableRow></DataTableRow>
              </DataTableHead>
              {/*Head*/}
              {catedata.length > 0
                ? catedata.map((item, index) => {
                    let timez = new Date(item.created_at);
                    const monthNames = [
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                      "May",
                      "Jun",
                      "Jul",
                      "Aug",
                      "Sept",
                      "Oct",
                      "Nov",
                      "Dec",
                    ];
                    const day = timez.getDate();
                    const monthIndex = timez.getMonth();
                    const year = timez.getFullYear();
                    const formattedDate = `${monthNames[monthIndex]} ${day}  ${year}`;
                    return (
                      <DataTableItem key={index}>
                        <DataTableRow>
                          <div className="caption-text">{item.title}</div>
                        </DataTableRow>
                        <DataTableRow>
                          <div className="caption-text">{item.url}</div>
                        </DataTableRow>
                        <DataTableRow>
                          <div className="caption-text">
                            <span
                              style={{
                                display: "inline-block",
                                width: "60px",
                                height: "60px",
                                borderRadius: "50%",
                              }}
                            >
                              <img src={item.file}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  display: "block",
                                  borderRadius: "50%",
                                }}
                                alt="image"
                              />
                            </span>
                          </div>
                        </DataTableRow>
                        <DataTableRow size="md">
                          <div className="sub-text d-inline-flex flex-wrap gx-2">
                            {formattedDate}
                          </div>
                        </DataTableRow>
                        <DataTableRow className="nk-tb-col-tools">
                          <ul className="nk-tb-actions gx-1">
                            <li>
                              <UncontrolledDropdown>
                                <DropdownToggle
                                  tag="a"
                                  className="dropdown-toggle btn btn-icon btn-trigger"
                                >
                                  <Icon name="more-h"></Icon>
                                </DropdownToggle>
                                <DropdownMenu end>
                                  <ul className="link-list-opt no-bdr">
                                    {/* <li>
                                      <DropdownItem
                                        tag="a"
                                        href="#eye"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                        }}
                                      >
                                        <Icon name="eye"></Icon>
                                        <span>View Category</span>
                                      </DropdownItem>
                                    </li> */}
                                   <li>
                                      <DropdownItem
                                        tag="a"
                                        href="#edit"
                                        onClick={(e) => handleEdit(e, item.id)}
                                      >
                                        <Icon name="edit"></Icon>
                                        <span>Edit</span>
                                      </DropdownItem>
                                    </li> 
                                    <li>
                                      <DropdownItem
                                        tag="a"
                                        href="#trash"
                                        onClick={(e) =>
                                          handleDelete(e, item.id)
                                        }
                                      >
                                        <Icon name="trash"></Icon>
                                        <span>delete</span>
                                      </DropdownItem>
                                    </li>
                                  </ul>
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            </li>
                          </ul>
                        </DataTableRow>
                      </DataTableItem>
                    );
                  })
                : ""}
            </DataTableBody>
            <div className="card-inner">
              {catedata.length > 0 ? (
                // <PaginationComponent
                //   itemPerPage={itemPerPage}
                //   totalItems={data.length}
                //   paginate={paginate}
                //   currentPage={currentPage}
                // />

                <ReactPaginate
                  previousLabel={"<"}
                  nextLabel={">"}
                  pageCount={last}
                  breakLabel={"..."}
                  marginPagesDisplayed={1}
                  pageRangeDisplayed={1}
                  onPageChange={handleNext}
                  containerClassName={"pagination"}
                  // pageClassName={'page-link'}
                  pageLinkClassName={"page-link"}
                  previousClassName={"page-item disabled"}
                  nextClassName={"page-item disabled"}
                  previousLinkClassName={"page-link-prev page-link"}
                  nextLinkClassName={"page-link-next page-link"}
                />
              ) : (
                <div className="text-center">
                  <span className="text-silent">No data found</span>
                </div>
              )}
            </div>
          </DataTable>
        </Block>
        <Block size="lg">
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h5">Add New Category</BlockTitle>
            </BlockHeadContent>
          </BlockHead>
          <PreviewCard>
            <div className="card-head">
              <h5 className="card-title">Category Setting</h5>
            </div>
            <form className="gy-3">
              <Row className="g-3 align-center">
                <Col lg="5">
                  <div className="form-group">
                    <label className="form-label" htmlFor="site-name">
                      Title
                    </label>
                    {/* <span className="form-note">The name that appears on your site.</span> */}
                  </div>
                </Col>
                <Col lg="7">
                  <div className="form-group">
                    {message ? (
                      <span className="form-note">{message}</span>
                    ) : (
                      ""
                    )}

                    <div className="form-control-wrap">
                      <input
                        type="text"
                        id="site-name"
                        className="form-control"
                        value={name}
                        onChange={(e) => Setname(e.target.value)}
                        placeholder="Title of the Video"
                      />
                    </div>
                  </div>
                </Col>
              </Row>

              <Row className="g-3 align-center">
                <Col lg="5">
                  <div className="form-group">
                    <label className="form-label" htmlFor="site-name">
                      Url
                    </label>
                    {/* <span className="form-note">The name that appears on your site.</span> */}
                  </div>
                </Col>
                <Col lg="7">
                  <div className="form-group">
                    {message ? (
                      <span className="form-note">{message}</span>
                    ) : (
                      ""
                    )}

                    <div className="form-control-wrap">
                      <input
                        type="text"
                        id="site-name"
                        className="form-control"
                        value={hypeurl}
                        onChange={(e) => SetHypeurl(e.target.value)}
                        placeholder="link"
                      />
                    </div>
                  </div>
                </Col>
              </Row>

              <Row className="g-3 align-center">
                <Col lg="5">
                  <div className="form-group">
                    <label className="form-label" htmlFor="site-name">
                      Image
                    </label>
                    {/* <span className="form-note">The name that appears on your site.</span> */}
                  </div>
                </Col>
                <Col lg="7">
                  <div className="form-group">
                    {message ? (
                      <span className="form-note">{message}</span>
                    ) : (
                      ""
                    )}

                    <div className="form-control-wrap">
                      <input
                        type="file"
                        id="site-name"
                        className="form-control"
                        onChange={(e) => SetFile(e.target.files[0])}
                        placeholder="image"
                      />
                    </div>
                      {editfile&&<div style={{ width:"120px", height:"70px", marginTop:"10px" }}>
                       <img src={editfile} alt="image" />
                    </div>}
                  
                  </div>
                </Col>
              </Row>


              <Row className="g-3 align-center">
                <Col lg="5">
                  <div className="form-group">
                    <label className="form-label" htmlFor="site-name">
                    Category
                    </label>
                    {/* <span className="form-note">The name that appears on your site.</span> */}
                  </div>
                </Col>
                <Col lg="7">
                  <div className="form-group">
                    {message ? (
                      <span className="form-note">{message}</span>
                    ) : (
                      ""
                    )}

                    <div className="form-control-wrap">
                      {/* <input
                        type="text"
                        id="site-name"
                        className="form-control"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="Category"
                      /> */}

                   <Select options={categorydata} value={category}  onChange={handleCate} classNamePrefix="react-select" className='react-select-container' />
                    </div>
                  </div>
                </Col>
              </Row>


              <Row className="g-3 align-center">
                <Col lg="5">
                  <div className="form-group">
                    <label className="form-label" htmlFor="site-name">
                    Video Id
                    </label>
                  </div>
                </Col>
                <Col lg="7">
                  <div className="form-group">
                    {message ? (
                      <span className="form-note">{message}</span>
                    ) : (
                      ""
                    )}

                    <div className="form-control-wrap">
                   
                      {/* <Select options={writerdata} value={writername}  onChange={handleWriter} classNamePrefix="react-select" className='react-select-container' /> */}
                          
                      <input
                        type="text"
                        id="site-name"
                        className="form-control"
                        value={writername}
                        
                        onChange={(e) =>setWritername(e.target.value)}
                        placeholder="Video Id"
                      />

                    </div>
                  </div>
                </Col>
              </Row>

              <Row className="g-3">
                <Col lg="7" className="offset-lg-5">
                  <div className="form-group mt-2">
                    {isEditnum? 
                              <Button
                              color="primary"
                              size="lg"
                              onClick={(e) => handleEditBtn(e)}
                            >
                             {loading ? <Spinner size="sm" color="light" /> : "Edit Video"}
                             
                            </Button>
                    :
                      <Button
                      color="primary"
                      size="lg"
                      onClick={(e) => handleCategories(e)}
                    >
                     {loading ? <Spinner size="sm" color="light" /> : "Add New Video"}
                     
                    </Button>
                    }
                  

                  </div>
                </Col>
              </Row>
            </form>
          </PreviewCard>
        </Block>
      </Content>

      <Modal isOpen={modalSuccess} toggle={toggleSuccess}>
        <ModalBody className="modal-body-lg text-center">
          <div className="nk-modal">
            <Icon className="nk-modal-icon icon-circle icon-circle-xxl ni ni-check bg-success"></Icon>
            <h4 className="nk-modal-title">
              {message ? message : "Successful"}{" "}
            </h4>
            <div className="nk-modal-text">
              {/* <div className="caption-text">
                           successful
                        </div> */}
              {/* <span className="sub-text-sm">
                          Learn when you reciveve bitcoin in your wallet.{" "}
                          <a href="#link" onClick={(ev) => ev.preventDefault()}>
                            {" "}
                            Click here
                          </a>
                        </span> */}
            </div>
            <div className="nk-modal-action">
              <Button
                color="primary"
                size="lg"
                className="btn-mw"
                onClick={toggleSuccess}
              >
                OK
              </Button>
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="bg-light">
          <div className="text-center w-100">
            {/* <p>
                        Earn upto $25 for each friend your refer!{" "}
                        <a href="#invite" onClick={(ev) => ev.preventDefault()}>
                          Invite friends
                        </a>
                      </p> */}
          </div>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalFail} toggle={toggleModalFail}>
        <ModalBody className="modal-body-lg text-center">
          <div className="nk-modal">
            <Icon className="nk-modal-icon icon-circle icon-circle-xxl ni ni-cross bg-danger"></Icon>
            <h4 className="nk-modal-title">
              {" "}
              {message ? message : "Unable to Process!"}{" "}
            </h4>
            <div className="nk-modal-text">
              {/* <p className="text-soft">If you need help please contact us at (855) 485-7373.</p> */}
            </div>
            <div className="nk-modal-action mt-5">
              <Button
                color="light"
                size="lg"
                className="btn-mw"
                onClick={toggleModalFail}
              >
                Return
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default DocumentVideos;
