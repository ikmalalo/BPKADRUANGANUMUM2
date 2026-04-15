interface Props {
  open: boolean
  status: string
  onCancel: () => void
  onConfirm: () => void
}

export default function ConfirmModal({
  open,
  status,
  onCancel,
  onConfirm
}: Props) {

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">

      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      <div className="relative bg-white w-[380px] rounded-xl shadow-xl p-6 animate-[scaleIn_.25s_ease]">

        <h3 className="text-lg font-bold mb-2">
          Konfirmasi Perubahan Status
        </h3>

        <p className="text-gray-600 mb-6">
          Ubah status menjadi{" "}
          <span className="font-semibold text-orange-500">
            {status}
          </span>{" "}
          ?
        </p>

        <div className="flex justify-end gap-3">

          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border hover:bg-gray-100"
          >
            Batal
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600"
          >
            Ya, Ubah
          </button>

        </div>

      </div>
    </div>
  )
}