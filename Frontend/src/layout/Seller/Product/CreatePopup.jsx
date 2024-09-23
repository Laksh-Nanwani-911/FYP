import React, { useEffect, useRef, useState } from 'react'
import { ImCross } from 'react-icons/im'
import axios from 'axios'
import { baseUrl } from '../../../constants/baseUrl'
import { Toaster, toast } from 'react-hot-toast';
import { BiDownArrow } from 'react-icons/bi';
import { Select } from "antd";


const CreatePopup = ({ setCreateProductPopup, setReFetch, reFetch }) => {


    const inputRef = useRef(null);
    const [productImage, setproductImage] = useState([])
    const [productDeatls, setProductDeatils] = useState({ title: "", description: "", quantity: "", price: "", categoryId: "" })
    const [loader, setloader] = useState(false)
    const [images, setImages] = useState([])
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState("");
    const [categoriesList, setCategoriesList] = useState([]);

    const tempList = [];

    const getCategories = () => {
        axios.get(`${baseUrl}/category/get-all-active-categories`,)
            .then((res) => {
                // console.log(res.data.data);
                setCategories(res.data.data)
            })
    }
    useEffect(() => {
        getCategories()
    }, [])


    useEffect(() => {
        if (categories.length > 0) {
            categories.map((item, index) => {
                tempList.push({ value: `${item._id}`, label: `${item.name}` });
            });
            setCategoriesList(tempList);
        }
    }, [categories]);



    const handleOnChange = (e) => {
        setproductImage(e.target.files)
    };

    const handleClick = () => {
        inputRef.current.click();
    };

    const onChangeInput = (e) => {
        setProductDeatils({ ...productDeatls, [e.target.name]: e.target.value })
    }


    const submitData = async () => {
        setloader(true)
        if (!productDeatls.description || categoryId == "" || productImage.length === 0 || !productDeatls.price || !productDeatls.quantity || !productDeatls.title) {
            setloader(false)
            toast.error("All Fields Are Required")
        }

        else {
            const imageArray = Array.from(productImage);
            const base64Images = await Promise.all(
                imageArray.map((file) => {
                    return new Promise((resolve, reject) => {
                        let reader = new FileReader();
                        reader.onload = function () {
                            resolve(reader.result);
                        };
                        reader.onerror = function (error) {
                            reject(error);
                        };
                        reader.readAsDataURL(file);
                    });
                })
            );
            const bodyData = {
                title: productDeatls.title,
                description: productDeatls.description,
                price: productDeatls.price,
                quantity: productDeatls.quantity,
                categoryId: categoryId,
                images: base64Images,
            };

            console.log(bodyData)
            axios.post(`${baseUrl}/product/create-new-product`, bodyData, { headers: { authorization: `Bearer ${localStorage.getItem("sellerToken")}` } })
                .then((res) => {
                    console.log(res)
                    setloader(false)
                    if (res.status === 201) {
                        toast.success("Product Created")
                        setTimeout(() => {
                            setReFetch(!reFetch)
                            setCreateProductPopup(false)
                        }, 3000);
                    }
                })
                .catch((e) => {
                    setloader(false)
                    console.log(e)
                    if (e.response.status === 400) {
                        toast.error("Title Alreadys Exits")
                    }
                })
        }


    }

    // useEffect(() => {
    //     console.log(productImage.length, 'length')
    //     for (let i = 0; i < productImage.length; i++) {
    //         let reader = new FileReader();
    //         console.log(productImage[i], 'index')
    //         reader.onload = function () {
    //             reader.readAsDataURL(productImage[i]);
    //             setImages([...images, reader.result])
    //         };
    //         reader.onerror = function (error) {
    //             console.log('Error: ', error);
    //         };
    //     }
    // }, [productImage])


    return (


        <div className='bg-white p-2 sm:w-[50%] md:w-[30%] rounded-md font-mont sm:m-0 m-3'>

            <div className='flex justify-between items-center'>
                <h1 className='text-lg'>Create Product</h1>
                <ImCross onClick={() => setCreateProductPopup(false)} className='cursor-pointer' />
            </div>

            {/* MAIN INPUT FIELDS  */}
            <div className='mt-3'>

                {/* PRODUCT NAME AND DESCRIPTION  */}
                <div className='block sm:flex sm:justify-between sm:items-center sm:gap-x-3'>
                    <input style={{ border: "1px solid lightgray" }} onChange={onChangeInput} className='outline-none flex-none w-[100%] sm:mb-0 mb-2  sm:flex-1 h-[2.2rem] rounded-md pl-2 pr-2 placeholder:text-sm' type="text" name='title' placeholder='Enter Product Name' />
                </div>

                <div className='sm:mt-3'>
                    <textarea style={{ border: "1px solid lightgray" }} onChange={onChangeInput} className='outline-none flex-none w-[100%] sm:mb-0  sm:flex-1 h-[3rem] sm:h-[7rem] pt-2 pb-2 resize-none rounded-md pl-2 pr-2 placeholder:text-sm' type="text" name='description' placeholder='Enter Product Description' />
                </div>


                {/* PRODUCT PRICE AND QUANTITY  */}

                <div className='block sm:flex sm:justify-between sm:items-center sm:gap-x-3 mb-3'>
                    <input onChange={onChangeInput} style={{ border: "1px solid lightgray" }} className='outline-none flex-none w-[100%] sm:mb-0 mb-2 sm:flex-1 h-[2.2rem] rounded-md pl-2 pr-2 placeholder:text-sm' type="number" name='price' placeholder='Enter Product Price' />
                    <input onChange={onChangeInput} style={{ border: "1px solid lightgray" }} className='outline-none flex-none w-[100%] sm:mb-0 mb-2 sm:flex-1 h-[2.2rem] rounded-md pl-2 pr-2 placeholder:text-sm' type="number" name='quantity' placeholder='Enter Product Quantity' />
                </div>

                {/* PRODUCT CATEGORY  */}

                <div className='relative mb-3'>

                    <Select
                        showSearch
                        value={categoryId}
                        style={{ width: "100%", height: 36 }}
                        placeholder="Select Category"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            (option?.label ?? "").includes(input)
                        }
                        filterSort={(optionA, optionB) =>
                            (optionA?.label ?? "")
                                .toLowerCase()
                                .localeCompare((optionB?.label ?? "").toLowerCase())
                        }
                        onChange={(e) => {
                            console.log(e);
                            setCategoryId(e)
                        }}

                        options={categoriesList}
                    />

                </div>

                {/* <div className='block sm:flex sm:justify-between sm:items-center sm:gap-x-3 mb-3'>
                    <input onChange={onChangeInput} style={{ border: "1px solid lightgray" }} className='outline-none flex-none w-[100%] sm:mb-0 mb-2 sm:flex-1 h-[2.2rem] rounded-md pl-2 pr-2 placeholder:text-sm' type="text" name='categoryId' placeholder='Enter Your Category' />
                </div> */}

                {/* IMAGE UPLOAD  */}
                <div style={{ border: "1px solid lightgray" }} className={`h-[2.2rem] flex justify-center items-center rounded-md ${productImage.length > 0 && "bg-[#4f619f]"}`}>
                    <label htmlFor="file-input">
                        <button className={`text-sm ${productImage.length > 0 ? "text-[#eff3fc]" : "text-[gray]"}`} onClick={handleClick}>{productImage.length > 0 ? "File Uploaded" : "Upload File"}</button>
                    </label>
                    <input id="file-input" multiple type="file" ref={inputRef} onChange={handleOnChange} style={{ display: 'none' }} />
                </div>

                {/* ADD PRODUCT  */}
                <div style={{ border: "1px solid lightgray" }} className='rounded-md flex justify-center items-center mt-3 shadow-otpShadow bg-[#4f619f]' onClick={submitData}>
                    <div className='flex justify-center gap-x-3 items-center text-[#eff3fc] cursor-pointer  w-[8rem] sm:w-[10rem] h-[2.1rem] rounded-md'>
                        <button className="text-sm cursor-pointer">{loader ? "Loading ..." : "Post Product"}</button>
                    </div>
                </div>


            </div>

            {/* TOASTER  */}
            <Toaster position="top-right" toastOptions={{ duration: 3000, }} />
        </div>
    )
}

export default CreatePopup
