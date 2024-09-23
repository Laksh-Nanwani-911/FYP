// import React from 'react'
// import HeroBg from '../../../assets/home/herobg.png'
// import HeroImg from '../../../assets/home/heroImg.png'
// import BgImg from '../../../assets/home/bgImg.jpg'

// const Hero = () => {



//   return (
//     <div className='bg-cover bg-center pl-3 pr-3 font-lato w-screen h-[30rem]' style={{ backgroundImage: `url(${BgImg})` }}>

//       <div className='flex justify-evenly items-center h-[100%]'>

//         {/* TEXT AND BUTTONS */}
//         <div data-aos="fade-left">

//           {/* <div>
//             <p className='text-[#5a3ead] text-lg font-lato font-semibold mb-1'>Top sales on this week</p>
//             <h1 className='text-3xl font-mont font-semibold'>Explore Amazing</h1>
//             <h1 className='text-3xl font-mont font-semibold'>Trending Products</h1>
//             <h1 className='text-3xl font-mont font-semibold'>On This Season</h1>
//           </div>

//           <div className='flex items-start gap-x-5 mt-4'>
//             <button className='w-[7.3rem] h-[2.2rem] rounded-3xl text-sm cursor-pointer text-white font-mont bg-[#6616db]'>Shop Now</button>
//             <button className='w-[7.3rem] h-[2.2rem] rounded-3xl text-sm cursor-pointer text-white font-mont bg-[#ff496c]'>Learn More</button>
//           </div> */}

//         </div>

//         {/* IMAGE  */}
//         {/* <div className='sm:block hidden'>
//           <img src={HeroImg} alt="" className='h-[22rem]' />
//         </div> */}

//       </div>

//     </div>
//   )
// }

// export default Hero


import React from 'react';
//import HeroBg from '../../../assets/home/herobg.png';
import BgImg1 from '../../../assets/home/bgImg.jpg';
import BgImg2 from '../../../assets/home/bgImg2.jpg';
import BgImg3 from '../../../assets/B-1.jpeg';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

const Hero = () => {
  return (
    <div className='bg-cover bg-center pl-3 pr-3 font-lato w-screen h-[30rem] z-0'>
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 2000, disableOnInteraction: true }}
        loop={true}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className='z-0'
      >
        <SwiperSlide>
          <div
            className='bg-cover bg-center w-full h-[30rem]'
            style={{ backgroundImage: `url(${BgImg1})` }}
          ></div>
        </SwiperSlide>
        <SwiperSlide>
          <div
            className='bg-cover bg-center w-full h-[30rem]'
            style={{ backgroundImage: `url(${BgImg2})` }}
          ></div>
        </SwiperSlide>
        <SwiperSlide>
          <div
            className='bg-cover bg-center w-full h-[30rem]'
            style={{ backgroundImage: `url(${BgImg3})` }}
          ></div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Hero;

