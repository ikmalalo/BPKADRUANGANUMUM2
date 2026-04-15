import HomeHeader from "../components/HomeComponents/HomeHeader"
import HomeContainer from "../components/HomeComponents/HomeContainer"
import HomeFooter from "../components/HomeComponents/HomeFooter"
import HomeBackground from "../components/HomeComponents/HomeBackground"
import "../index.css"

export default function HomeSelect() {
  return (
    <div className="h-screen bg-white flex flex-col items-center relative overflow-hidden">
      
      {/* Premium Animated Background */}
      <HomeBackground />

      {/* Main Content with Entrance Animation */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-between py-[2vh] md:py-0 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-forwards overflow-hidden">
        <HomeHeader />
        
        <div className="flex-grow flex items-center justify-center w-full">
          <HomeContainer />
        </div>
        
        <HomeFooter />
      </div>

    </div>
  )
}
