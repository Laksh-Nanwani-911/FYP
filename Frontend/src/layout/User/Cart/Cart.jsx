import React from 'react'
import { AiOutlinePlus, AiOutlineMinus, AiFillDelete } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { decrement, increment, remove } from '../../../store/slices/cart'
const Cart = () => {

    const products = useSelector(state => state.cart)
    const dispatch = useDispatch()
    const nav = useNavigate()

    const incrementQuantity = (product) => {
        dispatch(increment(product))
    }

    const decrementQuantity = (product) => {
        dispatch(decrement(product))

    }

    const deleteProduct = (id) => {
        console.log(id)
        dispatch(remove(id))
    }


    const handleCheckout = () => {
        nav("/checkout")
    }

    return (

        <div>
            <div className='w-[100%] h-[1px] bg-gray-200 font-popins '></div>
            {
                products.length > 0 ?
                    <div className='md:flex block w-screen h-screen overflow-y-auto'>
                        {/* MAIN CART ITEMS */}

                        <div className='flex-1 bg-white'>

                            <h1 className='text-xl ml-5 mt-5'>Shopping Cart</h1>
                            <div className='w-[100%] h-[1px] mt-5 bg-gray-200 font-popins '></div>

                            <div className='md:h-[60.5vh] md:max-h-[60.5vh] max-h-[50vh] h-[100%] overflow-y-auto'>
                                {
                                    products?.map((item, index) => {
                                        return (
                                            <div key={index}>
                                                <div className='mt-4 flex justify-between items-center'>

                                                    {/* IMAGE AND TITLE  */}
                                                    <div className='flex sm:gap-x-3 gap-x-3 items-center ml-5 w-[15rem] overflow-x-auto'>
                                                        <img src={item?.images[0].url} alt="" className='sm:w-[5rem] w-[2.5rem] sm:h-[5rem] h-[2.5rem]' />
                                                        <p className='font-medium sm:text-base text-xs tracking-wide text-slate-600 text-nowrap'>{item?.title}</p>
                                                    </div>

                                                    {/* INCREASE DECRESE BUTTON  */}
                                                    <div className='flex bg-slate-200 items-center justify-between sm:w-[8rem] w-[4.5rem] h-[2rem] sm:h-[3rem] rounded-lg p-2'>
                                                        <AiOutlinePlus onClick={() => incrementQuantity(item)} className='sm:text-xl text-xs cursor-pointer' />
                                                        <p className=' font-popins sm:font-bold font-light text-sm'>{item.quantity}</p>
                                                        <AiOutlineMinus onClick={() => decrementQuantity(item)} className='sm:text-xl text-xs cursor-pointer' />
                                                    </div>

                                                    {/* PRICE  */}
                                                    <div>
                                                        <p className='sm:text-lg text-sm'>Rs {item?.price * item?.quantity}</p>
                                                    </div>
                                                    {/* DELETE  */}
                                                    <div>
                                                        {/* <p className='text-medium text-red-700 cursor-pointer'>Delete</p> */}
                                                        <AiFillDelete onClick={() => deleteProduct(item._id)} className='sm:text-xl text-base text-red-600 cursor-pointer mr-4' />
                                                    </div>
                                                </div>
                                                <div className='w-[100%] h-[1px] mt-2 mb-2 bg-gray-200 font-popins'></div>
                                            </div>
                                        )
                                    })
                                }
                            </div>

                        </div>

                        <div className='w-[1px] md:block hidden h-[100%] bg-gray-200'></div>

                        {/* TOTAL  */}
                        <div className='flex-[0.2] md:h-[83.5vh] mb-[5rem] sm:mb-0 p-5 relative'>
                            <h1 className='text-lg tracking-wide'>Order Details</h1>
                            <div className='w-[100%] h-[1px] mt-5  bg-gray-200 font-popins '></div>

                            <h1 className='text-lg tracking-wide mt-4 mb-3'>Sub Total</h1>
                            <h1 className='text-lg tracking-wide mb-4'> <span className='font-bold '>Rs</span> {products?.reduce((total, item) => total + item.price * item.quantity, 0)}</h1>
                            <input className={"w-[100%] h-[3rem] outline-none rounded-md shadow-otpShadow pl-4 pr-4"} placeholder={"Promo Code"} />
                            <div className=''>
                                <button onClick={handleCheckout} text={"Checkout"} className={"w-[100%] mt-4 h-[2.4rem] font-popins bg-[#3b5877] text-white rounded-md"} >Checkout</button>
                            </div>

                        </div>

                    </div> :

                    <div className='flex justify-center items-center h-[80vh] md:h-[70vh]'>
                        <h1 className='text-5xl font-cursive'>No Item Found</h1>
                    </div>
            }
        </div>
    )
}

export default Cart