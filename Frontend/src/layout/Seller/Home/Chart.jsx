import React from 'react'
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, ResponsiveContainer } from 'recharts'

const Chart = () => {

    const chartData = [{ month: "Jan", amount: 300 }, { month: "Feb", amount: 50 }, { month: "Mar", amount: 150 }, { month: "Apr", amount: 100 }, { month: "May", amount: 400 }, { month: "Jun", amount: 250 }, { month: "Jul", amount: 170 }, { month: "Aug", amount: 200 }, { month: "Sep", amount: 210 }, { month: "Oct", amount: 180 }, { month: "Nov", amount: 40 }, { month: "Dec", amount: 120 }]

    return (
        <div className='flex justify-between items-start gap-4 mt-8'>

            <div className='flex-1 h-[17rem] bg-[#ffff] rounded-md pb-3 shadow-cardShadow'>
                <h1 className='pt-3 pl-3'>Sales Chart</h1>
                <div className='mt-3'>
                    <ResponsiveContainer width="100%" height={230} className={"ml-[-10px]"}>
                        <BarChart data={chartData} width={800} height={220}>
                            <YAxis dataKey={"amount"} tickFormatter={(value) => `$${value}`} axisLine={false} stroke='#3741d8' tickLine={false} style={{ fontSize: "0.8rem" }} />
                            <XAxis dataKey={"month"} axisLine={false} stroke='#3741d8' tickLine={false} style={{ fontSize: "0.8rem" }} />
                            <Bar dataKey={"amount"} fill='#3741d8' />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className='bg-[#ffff] w-[17rem] h-[17rem] rounded-md hidden lg:flex justify-center items-center shadow-cardShadow'>
                <PieChart width={200} height={300}>
                    <Pie data={chartData} cx="50%" cy="50%" dataKey={"amount"} fill="#3741d8" />
                </PieChart>
            </div>
        </div>
    )
}

export default Chart
