import React, { useEffect, useRef, useState } from 'react'
import { ImCross } from 'react-icons/im'
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import { baseUrl } from '../../../constants/baseUrl'
import { Toaster, toast } from 'react-hot-toast'
import { Select } from "antd";

const UpdatePopup = ({ item, setUpdateProductPopup, setReFetch, reFetch, proudctId }) => {
    // console.log("item", item);
    const inputRef = useRef(null);
    const [discountedAmount, setdiscountedAmount] = useState(0)
    const [productImage, setproductImage] = useState([])
    const [singleData, setsingleData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState(item.category._id);
    const [categoriesList, setCategoriesList] = useState([]);
    const [productDeatls, setProductDeatils] = useState({
        title: item.title,
        description: item.description,
        quantity: item.quantity,
        price: item.price,
        categoryId: categoryId,
        isActive: item.isActive,
    });



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
    const [loader, setloader] = useState(false)

    // const handleOnChange = (e) => {
    //     setproductImage(e.target.files)
    // };


    // const handleClick = () => {
    //     inputRef.current.click();
    // };

    const onChangeInput = (e) => {
        setProductDeatils({ ...productDeatls, [e.target.name]: e.target.value })
    }

    const getSingleProduct = () => {
        axios.get(`${baseUrl}/product/get-product/${proudctId}`, { headers: { authorization: `Bearer ${localStorage.getItem("sellerToken")}` } })
            .then((res) => {
                setsingleData(res.data?.data)
            })
    }
    useEffect(() => {
        getSingleProduct()
    }, [])

    const submitData = async () => {
        console.log("productDeatls", productDeatls);
        setloader(true)
        // productDeatls.categoryId==="" && setProductDeatils({...productDeatls,categoryId:singleData.category})


        axios.put(`${baseUrl}/seller/update-product/${proudctId}`, productDeatls,
            { headers: { authorization: `Bearer ${localStorage.getItem("sellerToken")}` } }
        )
            .then((res) => {
                console.log(res)
                if (res.status === 200) {
                    toast.success('Product Updated')
                    setloader(false)
                    setTimeout(() => {
                        setReFetch(!reFetch)
                        setUpdateProductPopup(false)
                    }, 2000);

                }
            })
            .catch((e) => {
                console.log(e)
            })
    }


    return (


        <div className='bg-white p-2 sm:w-[50%] md:w-[30%] rounded-md font-mont sm:m-0 m-3'>

            <div className='flex justify-between items-center'>
                <h1 className='text-lg'>Update Product</h1>
                <ImCross onClick={() => setUpdateProductPopup(false)} className='cursor-pointer' />
            </div>

            {/* MAIN INPUT FIELDS  */}
            <div className='mt-3'>

                {/* PRODUCT NAME AND DESCRIPTION  */}
                <div className='block sm:flex sm:justify-between sm:items-center sm:gap-x-3'>
                    <input value={productDeatls?.title} style={{ border: "1px solid lightgray" }} onChange={onChangeInput} className='outline-none flex-none w-[100%] sm:mb-0 mb-2  sm:flex-1 h-[2.2rem] rounded-md pl-2 pr-2 placeholder:text-sm' type="text" name='title' placeholder='Enter Product Name' />
                </div>

                <div className='sm:mt-3'>
                    <textarea value={productDeatls?.description} style={{ border: "1px solid lightgray" }} onChange={onChangeInput} className='outline-none flex-none w-[100%] sm:mb-0  sm:flex-1 h-[3rem] sm:h-[7rem] pt-2 pb-2 resize-none rounded-md pl-2 pr-2 placeholder:text-sm' type="text" name='description' placeholder='Enter Product Description' />
                </div>

                {/* PRODUCT PRICE AND QUANTITY  */}

                <div className='block sm:flex sm:justify-between sm:items-center sm:gap-x-3 mb-3'>
                    <input value={productDeatls?.price} onChange={onChangeInput} style={{ border: "1px solid lightgray" }} className='outline-none flex-none w-[100%] sm:mb-0 mb-2 sm:flex-1 h-[2.2rem] rounded-md pl-2 pr-2 placeholder:text-sm' type="number" name='price' placeholder='Enter Product Price' />
                    <input value={productDeatls?.quantity} onChange={onChangeInput} style={{ border: "1px solid lightgray" }} className='outline-none flex-none w-[100%] sm:mb-0 mb-2 sm:flex-1 h-[2.2rem] rounded-md pl-2 pr-2 placeholder:text-sm' type="number" name='quantity' placeholder='Enter Product Quantity' />
                </div>

                <div className='relative mb-3'>

                    <Select
                        showSearch
                        defaultValue={categoryId}
                        value={categoryId}
                        style={{ width: "100%", height: 36 }}
                        placeholder="Select Category"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            (option?.label ?? "").includes(input)
                        }
                        name="categoryId"
                        filterSort={(optionA, optionB) =>
                            (optionA?.label ?? "")
                                .toLowerCase()
                                .localeCompare((optionB?.label ?? "").toLowerCase())
                        }
                        onChange={(e) => {
                            // console.log("e: ", e)
                            setCategoryId(e)
                            setProductDeatils((productDetails) => ({ ...productDetails, categoryId: e }));
                        }}
                        options={categoriesList}
                    />

                </div>

                {/* <div className='block sm:flex sm:justify-between sm:items-center sm:gap-x-3 mb-3'>
                    <input value={productDeatls?.categoryId} onChange={onChangeInput} style={{ border: "1px solid lightgray" }} className='outline-none flex-none w-[100%] sm:mb-0 mb-2 sm:flex-1 h-[2.2rem] rounded-md pl-2 pr-2 placeholder:text-sm' type="text" name='categoryId' placeholder='Enter Your Category' />
                </div> */}

                {/* IMAGE UPLOAD  */}
                {/* <div style={{ border: "1px solid lightgray" }} className={`h-[2.2rem] flex justify-center items-center rounded-md ${productImage.length > 0 && "bg-[#4f619f]"}`}>
                    <label htmlFor="file-input">
                        <button className={`text-sm ${productImage.length > 0 ? "text-[#eff3fc]" : "text-[gray]"}`} onClick={handleClick}>{productImage.length > 0 ? "File Uploaded" : "Upload File"}</button>
                    </label>
                    <input id="file-input" multiple type="file" ref={inputRef} onChange={handleOnChange} style={{ display: 'none' }} />
                </div> */}

                {/* ADD PRODUCT  */}
                <div style={{ border: "1px solid lightgray" }} className='rounded-md flex justify-center items-center mt-3 shadow-otpShadow bg-[#4f619f]' onClick={submitData}>
                    <div className='flex justify-center gap-x-3 items-center text-[#eff3fc] cursor-pointer  w-[8rem] sm:w-[10rem] h-[2.1rem] rounded-md'>
                        <button className="text-sm cursor-pointer">{loader ? "Loading ..." : "Update Product"}</button>
                    </div>
                </div>


            </div>

            {/* TOASTER  */}
            <Toaster position="top-right" toastOptions={{ duration: 3000, }} />
        </div>
    )
}

export default UpdatePopup