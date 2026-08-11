import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { Borrow } from '@/services/seguimientoService'

export function useExportSeguimiento() {
  const exportExcel = (borrows: Borrow[]) => {
    const data = borrows.map(b => ({
      Trabajador: b.user?.name,
      Herramienta: b.tool?.name,
      Fecha: new Date(b.borrowedAt).toLocaleDateString(),
      Estado: b.status
    }))

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Préstamos')
    XLSX.writeFile(wb, `seguimiento_herramientas_${Date.now()}.xlsx`)
  }

  const exportPDF = (borrows: Borrow[]) => {
    const doc = new jsPDF()
    doc.setFontSize(14)
    doc.text('Seguimiento de Herramientas', 14, 15)

    const rows: string[][] = borrows.map(b => [
      b.user?.name ?? '',
      b.tool?.name ?? '',
      new Date(b.borrowedAt).toLocaleDateString(),
      b.status ?? ''
    ])

    ;(autoTable as any)(doc, {
      head: [['Trabajador', 'Herramienta', 'Fecha', 'Estado']],
      body: rows,
      startY: 22
    })

    doc.save(`seguimiento_herramientas_${Date.now()}.pdf`)
  }

  return { exportExcel, exportPDF }
}
