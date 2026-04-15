import logo from "../../assets/images/logo.png"

export default function ServiceHeader() {
  return (
    <div className="mt-10 flex items-center justify-center gap-4">
      <img src={logo} className="w-full max-w-[280px] md:max-w-[400px]" />
    </div>
  )
}