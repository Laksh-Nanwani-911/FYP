import { useEffect } from 'react'
import AOS from "aos";
import "aos/dist/aos.css";

const AosAnimation = () => {
  useEffect(() => {
    AOS.init({duration: 2000});
  }, [])

  return null
}

export default AosAnimation