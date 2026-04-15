import ServiceHeader from "../components/ServiceComponents/ServiceHeader"
import ServiceContainer from "../components/ServiceComponents/ServiceContainer"
import ServiceFooter from "../components/ServiceComponents/ServiceFooter"
import "../index.css"

export default function ServiceSelect() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-6 md:px-0">

      <ServiceHeader />

      <ServiceContainer />

      <ServiceFooter />

    </div>
  )
}