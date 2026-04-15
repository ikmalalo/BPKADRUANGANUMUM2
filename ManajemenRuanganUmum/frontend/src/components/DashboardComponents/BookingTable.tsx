import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Check, Calendar, MapPin, Clock, User, Users } from "lucide-react"
import ConfirmModal from "./ConfirmModal"
import Toast from "./Toast"
import { apiUrl } from "../../lib/api"

interface Props {
statusFilter:string
tempatFilter:string
hariFilter:string
bpkadData:any[]
pemkotData:any[]
setBpkadData:any
setPemkotData:any
selectedAgenda: any | null
setSelectedAgenda: (agenda: any | null) => void
}

const AgendaCard = ({ item, index, realIndex, type, isSelected, onClick, onStatusChange, onConfirmStatus, currentStatus, statusColor }: any) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white p-4 rounded-xl shadow-sm border-2 transition-all cursor-pointer ${
        isSelected 
          ? (type === 'bpkad' ? 'border-orange-500 bg-orange-50/50' : 'border-indigo-500 bg-indigo-50/50') 
          : 'border-gray-100 hover:border-gray-200'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
         <div className="flex items-center gap-2">
           <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase ${type === 'bpkad' ? 'bg-orange-500 text-white' : 'bg-indigo-600 text-white'}`}>
             #{realIndex + 1}
           </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${type === 'bpkad' ? 'bg-orange-100 text-orange-600' : 'bg-indigo-100 text-indigo-700'}`}>
             {type.toUpperCase()}
           </span>
         </div>
         <div 
           className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase shadow-sm ${statusColor(currentStatus)}`}
         >
           {currentStatus}
         </div>
      </div>
      
      <div className="space-y-2.5 mb-4">
        <h4 className="font-bold text-gray-900 leading-tight text-sm uppercase">{item.acara}</h4>
        
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
             <Calendar size={12} className="text-gray-400" />
             <span className="font-medium">{item.hari}, {item.tanggal.split(', ')[1] || item.tanggal}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-orange-500 font-bold">
             <Clock size={12} />
             <span>{item.pukul}</span>
          </div>
        </div>

        <div className="flex items-start gap-1.5 text-[11px] text-gray-600 font-bold">
           <MapPin size={12} className="text-gray-400 mt-0.5" />
           <span className="font-semibold uppercase">{item.tempat}</span>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 font-bold">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-bold">
             <User size={12} className="text-gray-400" />
             <span>{item.pelaksana}</span>
          </div>
          {item.dihadiri && (
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-bold">
               <Users size={12} className="text-gray-400" />
               <span>{item.dihadiri}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-3 gap-2">
         <div className="flex items-center gap-1">
            <button 
              onClick={(e) => { e.stopPropagation(); onStatusChange('left'); }} 
              className="p-2 border border-gray-200 rounded-lg bg-white hover:border-orange-400 transition-colors"
            >
              <ChevronLeft size={16} className="text-gray-600" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onStatusChange('right'); }} 
              className="p-2 border border-gray-200 rounded-lg bg-white hover:border-orange-400 transition-colors"
            >
              <ChevronRight size={16} className="text-gray-600" />
            </button>
         </div>
         <button 
           onClick={(e) => { e.stopPropagation(); onConfirmStatus(); }}
           className="flex-1 py-2 bg-green-500 text-white rounded-lg flex items-center justify-center gap-2 text-xs font-bold hover:bg-green-600 active:scale-95 transition-all shadow-sm"
         >
           <Check size={16}/> Simpan
         </button>
      </div>
    </div>
  )
}

export default function BookingTable({
statusFilter,
tempatFilter,
hariFilter,
bpkadData,
pemkotData,
setBpkadData,
setPemkotData,
selectedAgenda,
setSelectedAgenda
}:Props){

const statuses=["Selesai","Terjadwal","Berlangsung"]

const [tempStatus,setTempStatus]=useState<string[]>([])
const [tempPemkotStatus,setTempPemkotStatus]=useState<string[]>([])

useEffect(() => {
  setTempStatus(bpkadData.map((d:any)=>d.status))
}, [bpkadData])

useEffect(() => {
  setTempPemkotStatus(pemkotData.map((d:any)=>d.status))
}, [pemkotData])

const rowsPerPage=10
const [bpkadPage,setBpkadPage]=useState(1)
const [pemkotPage,setPemkotPage]=useState(1)

// Filters
let filteredBpkad=[...bpkadData]
if(statusFilter!=="Semua") filteredBpkad=filteredBpkad.filter(d=>d.status===statusFilter)
if(tempatFilter!=="Semua") filteredBpkad=filteredBpkad.filter(d=>d.tempat.includes(tempatFilter))
if(hariFilter==="Terjauh") filteredBpkad=[...filteredBpkad].reverse()

let filteredPemkot=[...pemkotData]
if(statusFilter!=="Semua") filteredPemkot=filteredPemkot.filter(d=>d.status===statusFilter)
if(tempatFilter!=="Semua") filteredPemkot=filteredPemkot.filter(d=>d.tempat.includes(tempatFilter))
if(hariFilter==="Terjauh") filteredPemkot=[...filteredPemkot].reverse()

// Slice
const startBpkad=(bpkadPage-1)*rowsPerPage
const currentBpkad=filteredBpkad.slice(startBpkad, startBpkad+rowsPerPage)
const totalBpkadPage=Math.ceil(filteredBpkad.length/rowsPerPage)

const startPemkot=(pemkotPage-1)*rowsPerPage
const currentPemkot=filteredPemkot.slice(startPemkot, startPemkot+rowsPerPage)
const totalPemkotPage=Math.ceil(filteredPemkot.length/rowsPerPage)

const [confirmModal,setConfirmModal]=useState({ open:false, type:"", index:-1, status:"" })
const [toast,setToast]=useState({ show:false, message:"" })

const handleRowClick = (item: any) => {
  if (selectedAgenda?.id === item.id) setSelectedAgenda(null)
  else setSelectedAgenda(item)
}

const changeStatus=(type: 'bpkad' | 'pemkot', index: number, dir: 'left' | 'right') => {
  const isBpkad = type === 'bpkad'
  const state = isBpkad ? tempStatus : tempPemkotStatus
  const setter = isBpkad ? setTempStatus : setTempPemkotStatus
  const offset = isBpkad ? startBpkad : startPemkot
  
  const realIndex = offset + index
  const currentIdx = statuses.indexOf(state[realIndex])
  let newIdx = currentIdx
  
  if(dir==="left" && currentIdx > 0) newIdx--
  if(dir==="right" && currentIdx < statuses.length - 1) newIdx++
  
  const newState = [...state]
  newState[realIndex] = statuses[newIdx]
  setter(newState)
}

const confirmStatusChange=(type:string, index:number) => {
  const isBpkad = type === "bpkad"
  const offset = isBpkad ? startBpkad : startPemkot
  const realIndex = offset + index
  const statusBaru = isBpkad ? tempStatus[realIndex] : tempPemkotStatus[realIndex]

  setConfirmModal({
    open:true,
    type,
    index: realIndex,
    status: statusBaru
  })
}

const applyStatusChange=async ()=>{
  const {type, index, status} = confirmModal;
  const targetData = type === "bpkad" ? bpkadData[index] : pemkotData[index];

  try {
    const response = await fetch(apiUrl(`/api/agendas/${targetData.id}/status`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) throw new Error('Failed to update status');

    if(type==="bpkad"){
      let newData=[...bpkadData]
      let newTemp=[...tempStatus]
      newData[index].status=status; 
      newTemp[index]=status;
      setBpkadData(newData); setTempStatus(newTemp);
    } else {
      let newData=[...pemkotData]
      let newTemp=[...tempPemkotStatus]
      newData[index].status=status; 
      newTemp[index]=status;
      setPemkotData(newData); setTempPemkotStatus(newTemp);
    }

    setToast({
      show:true,
      message: status==="Selesai" ? "Data berhasil diselesaikan" : `Status diubah ke ${status}`
    })
  } catch (error) {
    setToast({ show:true, message: "Gagal memperbarui status" })
  }
  setTimeout(()=>setToast({show:false,message:""}), 2000)
  setConfirmModal({...confirmModal, open:false})
}

const statusColor=(status:string)=>{
  if(status==="Berlangsung") return "bg-green-500 text-white"
  if(status==="Terjadwal") return "bg-blue-500 text-white"
  if(status==="Selesai") return "bg-red-500 text-white"
  return "bg-gray-300 text-gray-700"
}

const splitDate=(hari:string, tanggal:string)=>{
  const dateParts = tanggal.split(', ')
  const dateOnly = dateParts.length > 1 ? dateParts[1] : tanggal
  return(
    <div className="flex flex-col text-center">
      <span className="font-semibold">{hari}</span>
      <span className="text-xs text-gray-400">{dateOnly}</span>
    </div>
  )
}

return (
  <div className="space-y-12">
    {/* ================= BPKAD SECTION ================= */}
    <section>
      <h3 className="text-lg font-bold mb-4 text-gray-700 uppercase tracking-tight flex items-center gap-2">
        <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
        Agenda Ruang Rapat BPKAD
      </h3>

      {/* Mobile Component */}
      <div className="md:hidden space-y-4">
        {currentBpkad.length > 0 ? (
          currentBpkad.map((item, index) => (
            <AgendaCard 
              key={item.id}
              item={item}
              index={index}
              realIndex={startBpkad + index}
              type="bpkad"
              isSelected={selectedAgenda?.id === item.id}
              onClick={() => handleRowClick(item)}
              onStatusChange={(dir: any) => changeStatus('bpkad', index, dir)}
              onConfirmStatus={() => confirmStatusChange('bpkad', index)}
              currentStatus={tempStatus[startBpkad + index]}
              statusColor={statusColor}
            />
          ))
        ) : (
          <div className="p-8 text-center bg-white rounded-xl border-2 border-dashed text-gray-400 text-sm">
            Tidak ada data peminjaman BPKAD
          </div>
        )}
      </div>

      {/* Desktop Component */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-orange-500 text-white text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 text-center">NO</th>
                <th className="p-4 text-center">HARI / TANGGAL</th>
                <th className="p-4 text-center text-nowrap">TEMPAT</th>
                <th className="p-4 text-center">PUKUL</th>
                <th className="p-4 text-left">ACARA</th>
                <th className="p-4 text-center">PELAKSANA</th>
                <th className="p-4 text-center">STATUS</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {currentBpkad.map((item, index) => {
                const realIndex = startBpkad + index
                return (
                  <tr 
                    key={item.id}
                    onClick={() => handleRowClick(item)}
                    className={`border-b border-gray-100 hover:bg-orange-50/50 cursor-pointer transition-colors ${
                      selectedAgenda?.id === item.id ? "bg-orange-50" : ""
                    }`}
                  >
                    <td className="p-4 text-center font-bold text-gray-400">{realIndex + 1}</td>
                    <td className="p-4">{splitDate(item.hari, item.tanggal)}</td>
                    <td className="p-4 text-center font-semibold text-xs">{item.tempat}</td>
                    <td className="p-4 text-center text-orange-600 font-bold">{item.pukul}</td>
                    <td className="p-4 font-bold text-gray-900">{item.acara}</td>
                    <td className="p-4 text-center font-medium text-xs text-gray-500">{item.pelaksana}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1.5 focus-within:ring-2">
                        <button onClick={(e)=>{e.stopPropagation(); changeStatus('bpkad', index, 'left')}} className="p-1 border border-gray-200 rounded-md bg-white hover:bg-gray-50"><ChevronLeft size={14}/></button>
                        <div className={`w-[110px] py-1.5 flex items-center justify-center rounded-lg text-[10px] font-black uppercase shadow-sm ${statusColor(tempStatus[realIndex])}`}>
                          {tempStatus[realIndex]}
                        </div>
                        <button onClick={(e)=>{e.stopPropagation(); changeStatus('bpkad', index, 'right')}} className="p-1 border border-gray-200 rounded-md bg-white hover:bg-gray-50"><ChevronRight size={14}/></button>
                        <button onClick={(e)=>{e.stopPropagation(); confirmStatusChange('bpkad', index)}} className="p-1 bg-green-500 text-white rounded-md hover:bg-green-600 shadow-sm"><Check size={14}/></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination component logic for BPKAD */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4 px-2">
        <div className="text-xs text-gray-500 font-medium">
          Menampilkan <span className="text-gray-900">{startBpkad + 1} - {Math.min(startBpkad + rowsPerPage, filteredBpkad.length)}</span> dari <span className="text-gray-900">{filteredBpkad.length}</span> data
        </div>
        <div className="flex items-center gap-2">
          <button onClick={()=>setBpkadPage(p=>Math.max(p-1,1))} className="p-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50" disabled={bpkadPage===1}><ChevronLeft size={16}/></button>
          <span className="w-8 h-8 flex items-center justify-center bg-orange-500 text-white rounded-lg text-sm font-bold shadow-md shadow-orange-200">{bpkadPage}</span>
          <button onClick={()=>setBpkadPage(p=>Math.min(p+1,totalBpkadPage))} className="p-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50" disabled={bpkadPage===totalBpkadPage}><ChevronRight size={16}/></button>
        </div>
      </div>
    </section>

    {/* ================= PEMKOT SECTION ================= */}
    <section>
      <h3 className="text-lg font-bold mb-4 text-gray-700 uppercase tracking-tight flex items-center gap-2">
        <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
        Agenda Rapat Pemkot Samarinda
      </h3>

      {/* Mobile Component */}
      <div className="md:hidden space-y-4">
        {currentPemkot.length > 0 ? (
          currentPemkot.map((item, index) => (
            <AgendaCard 
              key={item.id}
              item={item}
              index={index}
              realIndex={startPemkot + index}
              type="pemkot"
              isSelected={selectedAgenda?.id === item.id}
              onClick={() => handleRowClick(item)}
              onStatusChange={(dir: any) => changeStatus('pemkot', index, dir)}
              onConfirmStatus={() => confirmStatusChange('pemkot', index)}
              currentStatus={tempPemkotStatus[startPemkot + index]}
              statusColor={statusColor}
            />
          ))
        ) : (
          <div className="p-8 text-center bg-white rounded-xl border-2 border-dashed text-gray-400 text-sm">
            Tidak ada data peminjaman Pemkot
          </div>
        )}
      </div>

      {/* Desktop Component */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-indigo-600 text-white text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 text-center">NO</th>
                <th className="p-4 text-center">HARI / TANGGAL</th>
                <th className="p-4 text-center text-nowrap">TEMPAT</th>
                <th className="p-4 text-center">PUKUL</th>
                <th className="p-4 text-left">ACARA</th>
                <th className="p-4 text-center">PELAKSANA</th>
                <th className="p-4 text-center">DIHADIRI</th>
                <th className="p-4 text-center">STATUS</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {currentPemkot.map((item, index) => {
                const realIndex = startPemkot + index
                return (
                  <tr 
                    key={item.id}
                    onClick={() => handleRowClick(item)}
                    className={`border-b border-gray-100 hover:bg-indigo-50/50 cursor-pointer transition-colors ${
                      selectedAgenda?.id === item.id ? "bg-indigo-50" : ""
                    }`}
                  >
                    <td className="p-4 text-center font-bold text-gray-400">{realIndex + 1}</td>
                    <td className="p-4">{splitDate(item.hari, item.tanggal)}</td>
                    <td className="p-4 text-center font-semibold text-xs">{item.tempat}</td>
                    <td className="p-4 text-center text-orange-600 font-bold">{item.pukul}</td>
                    <td className="p-4 font-bold text-gray-900">{item.acara}</td>
                    <td className="p-4 text-center font-medium text-xs text-gray-500">{item.pelaksana}</td>
                    <td className="p-4 text-center font-medium text-xs text-gray-500">{item.dihadiri}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1.5 focus-within:ring-2">
                        <button onClick={(e)=>{e.stopPropagation(); changeStatus('pemkot', index, 'left')}} className="p-1 border border-gray-200 rounded-md bg-white hover:bg-gray-50"><ChevronLeft size={14}/></button>
                        <div className={`w-[110px] py-1.5 flex items-center justify-center rounded-lg text-[10px] font-black uppercase shadow-sm ${statusColor(tempPemkotStatus[realIndex])}`}>
                          {tempPemkotStatus[realIndex]}
                        </div>
                        <button onClick={(e)=>{e.stopPropagation(); changeStatus('pemkot', index, 'right')}} className="p-1 border border-gray-200 rounded-md bg-white hover:bg-gray-50"><ChevronRight size={14}/></button>
                        <button onClick={(e)=>{e.stopPropagation(); confirmStatusChange('pemkot', index)}} className="p-1 bg-green-500 text-white rounded-md hover:bg-green-600 shadow-sm"><Check size={14}/></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination component logic for PEMKOT */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4 px-2">
        <div className="text-xs text-gray-500 font-medium">
          Menampilkan <span className="text-gray-900">{startPemkot + 1} - {Math.min(startPemkot + rowsPerPage, filteredPemkot.length)}</span> dari <span className="text-gray-900">{filteredPemkot.length}</span> data
        </div>
        <div className="flex items-center gap-2">
          <button onClick={()=>setPemkotPage(p=>Math.max(p-1,1))} className="p-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50" disabled={pemkotPage===1}><ChevronLeft size={16}/></button>
          <span className="w-8 h-8 flex items-center justify-center bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-md shadow-indigo-200">{pemkotPage}</span>
          <button onClick={()=>setPemkotPage(p=>Math.min(p+1,totalPemkotPage))} className="p-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50" disabled={pemkotPage===totalPemkotPage}><ChevronRight size={16}/></button>
        </div>
      </div>
    </section>

    <ConfirmModal
      open={confirmModal.open}
      status={confirmModal.status}
      onCancel={()=>setConfirmModal({...confirmModal,open:false})}
      onConfirm={applyStatusChange}
    />
    <Toast show={toast.show} message={toast.message} />
  </div>
)
}