import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../../constants/baseUrl";
const OrdersHistory = () => {
    const nav = useNavigate();
    const [orderData, setOrderData] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("customerToken");

    useEffect(() => {
        (async () => {
            let result = await axios.get(
                `${baseUrl}/order/get-all-orders`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            );
            setOrderData(result.data.data);
            setLoading(false);
        })();
    }, []);

    function formatDate(dateString) {
        // Create a new Date object from the provided date string
        const date = new Date(dateString);
        const options = { year: "numeric", month: "long", day: "numeric" };
        const formattedDate = date.toLocaleDateString("en-US", options);
        return formattedDate;
    }

    return (
        <div className="font-popins overflow-y-auto overflow-x-auto">
            <div className="p-3 w-[100%] overflow-x-auto">
                <div>
                    <h1>Orders History</h1>
                </div>

                {/* MAIN TABLE  */}
                {/* bg-[#ebeffa] */}
                <div className="mt-3 w-full overflow-x-scroll overflow-y-auto md:overflow-x-auto">
                    <table className="w-full mt-5">
                        <thead>
                            <tr className="">
                                <th className="py-2 pr-4 text-center font-normal whitespace-nowrap  border-b border-t border-gray-200">
                                    Order Id
                                </th>
                                <th className="py-2 pl-4 pr-4 text-center font-normal whitespace-nowrap  border-b border-t border-gray-200">
                                    Total Item
                                </th>
                                <th className="py-2 pl-4 pr-4 text-center font-normal whitespace-nowrap  border-b border-t border-gray-200">
                                    Order Date
                                </th>
                                <th className="py-2 pl-4 pr-4 text-center font-normal whitespace-nowrap  border-b border-t border-gray-200">
                                    Order Amount
                                </th>
                                <th className="py-2 pl-4 pr-4 text-center font-normal whitespace-nowrap  border-b border-t border-gray-200">
                                    Status
                                </th>
                                <th className="py-2 pl-4 pr-4 text-center font-normal whitespace-nowrap  border-b border-t border-gray-200">
                                    Payment Method
                                </th>
                                <th className="py-2 pl-4 pr-4 text-center font-normal whitespace-nowrap  border-b border-t border-gray-200">
                                    Delivery Address
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {!loading ? (
                                orderData.length == 0 ? (
                                    <tr className="w-[100%] text-center h-[50vh] ">
                                        <td colSpan={8} className="">
                                            <h1 className="text-xl sm:text-3xl font-cursive font-bold  text-center h-[65vh] flex justify-center items-center">
                                                NO ORDER HISTORY FOUND
                                            </h1>
                                        </td>
                                    </tr>
                                ) : (
                                    orderData?.map((item, index) => (
                                        <tr
                                            key={index}
                                            onClick={() => {
                                                nav("/order-summary", { state: item });
                                            }}
                                            className="cursor-pointer"
                                        >
                                            <td className=" pr-4 pt-4 pb-4 text-sm whitespace-nowrap border-b border-bg-gray-200 text-center">
                                                {item?._id}
                                            </td>

                                            <td className="pl-4 pr-4 pt-4 pb-4 text-sm whitespace-nowrap border-b border-bg-gray-200 text-center">
                                                {item?.items?.length}
                                            </td>
                                            <td className="pl-4 pr-4 pt-4 pb-4 text-sm whitespace-nowrap border-b border-bg-gray-200 text-center">
                                                {formatDate(item?.createdAt)}
                                            </td>
                                            <td className="pl-4 pr-4 pt-4 pb-4 text-sm whitespace-nowrap border-b border-bg-gray-200 text-center">
                                                {item?.totalAmount}
                                            </td>
                                            <td className="pl-4 pr-4 pt-4 pb-4 text-sm whitespace-nowrap border-b border-bg-gray-200 text-center">
                                                {item?.orderStatus}
                                            </td>
                                            <td className="pl-4 pr-4 pt-4 pb-4 text-sm whitespace-nowrap border-b border-bg-gray-200 text-center">
                                                {item?.paymentMode}
                                            </td>
                                            <td className="pl-4 pr-4 pt-4 pb-4 text-sm whitespace-nowrap border-b border-bg-gray-200 text-center">
                                                {item?.shippingDetails?.address}
                                            </td>


                                        </tr>
                                    ))
                                )
                            ) : (
                                <tr className="w-[100%] text-xl text-center h-[50vh] ">
                                    <td colSpan={8} className="">
                                        Loading...
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrdersHistory;
