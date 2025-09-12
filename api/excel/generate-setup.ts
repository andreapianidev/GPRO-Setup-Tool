import { Request, Response } from 'express'
import ExcelJS from 'exceljs'

export async function generateSetupExcel(req: Request, res: Response) {
  try {
    const startTime = Date.now()
    
    // Crea un nuovo workbook
    const workbook = new ExcelJS.Workbook()
    
    // Metadata del workbook
    workbook.creator = 'GPRO Setup Tool'
    workbook.lastModifiedBy = 'GPRO Setup Tool'
    workbook.created = new Date()
    workbook.modified = new Date()
    
    // Palette colori motorsport
    const colors = {
      headerDark: 'FF2C2C2C',
      headerGray: 'FF4A4A4A', 
      titleRed: 'FFDC143C',
      successGreen: 'FF32CD32',
      lightGray: 'FFF5F5F5',
      white: 'FFFFFFFF'
    }
    
    // 1. FOGLIO INPUT
    const inputSheet = workbook.addWorksheet('Input')
    
    // Intestazione principale
    inputSheet.mergeCells('A1:D1')
    const titleCell = inputSheet.getCell('A1')
    titleCell.value = 'DATI GARA - MELBOURNE GP'
    titleCell.font = { bold: true, size: 16, color: { argb: colors.titleRed } }
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' }
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.headerDark } }
    
    // Sezione Pista
    inputSheet.getCell('A3').value = 'PISTA'
    inputSheet.getCell('A3').font = { bold: true, color: { argb: colors.white } }
    inputSheet.getCell('A3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.headerGray } }
    
    inputSheet.getCell('A4').value = 'Nome:'
    inputSheet.getCell('B4').value = 'Melbourne'
    inputSheet.getCell('A5').value = 'Lunghezza:'
    inputSheet.getCell('B5').value = '5,303 km'
    inputSheet.getCell('A6').value = 'Giri:'
    inputSheet.getCell('B6').value = 58
    inputSheet.getCell('A7').value = 'Tipo:'
    inputSheet.getCell('B7').value = 'Road'
    
    // Sezione Meteo
    inputSheet.getCell('A9').value = 'METEO'
    inputSheet.getCell('A9').font = { bold: true, color: { argb: colors.white } }
    inputSheet.getCell('A9').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.headerGray } }
    
    inputSheet.getCell('A10').value = 'Q1:'
    inputSheet.getCell('B10').value = 'Dry 25°C'
    inputSheet.getCell('A11').value = 'Q2:'
    inputSheet.getCell('B11').value = 'Dry 27°C'
    inputSheet.getCell('A12').value = 'Gara:'
    inputSheet.getCell('B12').value = '30°C - 10% pioggia'
    
    // Sezione Auto
    inputSheet.getCell('A14').value = 'AUTO'
    inputSheet.getCell('A14').font = { bold: true, color: { argb: colors.white } }
    inputSheet.getCell('A14').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.headerGray } }
    
    inputSheet.getCell('A15').value = 'Engine:'
    inputSheet.getCell('B15').value = 'Livello 7 (12% usura)'
    inputSheet.getCell('A16').value = 'Brakes:'
    inputSheet.getCell('B16').value = 'Livello 6 (9% usura)'
    inputSheet.getCell('A17').value = 'Gear:'
    inputSheet.getCell('B17').value = 'Livello 7 (5% usura)'
    
    // Sezione Pilota
    inputSheet.getCell('A19').value = 'PILOTA'
    inputSheet.getCell('A19').font = { bold: true, color: { argb: colors.white } }
    inputSheet.getCell('A19').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.headerGray } }
    
    inputSheet.getCell('A20').value = 'Overall:'
    inputSheet.getCell('B20').value = 155
    inputSheet.getCell('A21').value = 'Peso:'
    inputSheet.getCell('B21').value = '72 kg'
    inputSheet.getCell('A22').value = 'Concentrazione:'
    inputSheet.getCell('B22').value = '75%'
    
    // Formattazione colonne
    inputSheet.getColumn('A').width = 20
    inputSheet.getColumn('B').width = 25
    
    // 2. FOGLIO SETUP
    const setupSheet = workbook.addWorksheet('Setup')
    
    // Intestazione
    setupSheet.mergeCells('A1:H1')
    const setupTitle = setupSheet.getCell('A1')
    setupTitle.value = 'SETUP OTTIMALE - MELBOURNE GP'
    setupTitle.font = { bold: true, size: 16, color: { argb: colors.titleRed } }
    setupTitle.alignment = { horizontal: 'center', vertical: 'middle' }
    setupTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.headerDark } }
    
    // Headers tabella
    const setupHeaders = ['Sessione', 'FW', 'RW', 'ENG', 'BRK', 'GEAR', 'SUS', 'Happy Range']
    setupHeaders.forEach((header, index) => {
      const cell = setupSheet.getCell(3, index + 1)
      cell.value = header
      cell.font = { bold: true, color: { argb: colors.white } }
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.headerGray } }
      cell.alignment = { horizontal: 'center' }
    })
    
    // Dati setup
    const setupData = [
      ['Q1', 43, 47, 600, 520, 410, 440, '±2 click'],
      ['Q2', 44, 46, 598, 522, 412, 438, '±2 click'],
      ['Gara', 45, 45, 602, 518, 408, 442, '±2 click']
    ]
    
    setupData.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        const cell = setupSheet.getCell(rowIndex + 4, colIndex + 1)
        cell.value = value
        cell.alignment = { horizontal: 'center' }
        
        // Bande alternate
        if (rowIndex % 2 === 1) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.lightGray } }
        }
      })
    })
    
    // Confidence
    setupSheet.getCell('A8').value = 'Confidence:'
    setupSheet.getCell('A8').font = { bold: true }
    setupSheet.getCell('B8').value = '82%'
    setupSheet.getCell('B8').font = { bold: true, color: { argb: colors.successGreen } }
    
    // Formattazione colonne
    setupSheet.columns.forEach(column => {
      column.width = 12
    })
    setupSheet.getColumn('A').width = 15
    setupSheet.getColumn('H').width = 15
    
    // 3. FOGLIO STRATEGIA
    const strategySheet = workbook.addWorksheet('Strategia')
    
    // Intestazione
    strategySheet.mergeCells('A1:D1')
    const strategyTitle = strategySheet.getCell('A1')
    strategyTitle.value = 'STRATEGIA CARBURANTE E PIT STOP'
    strategyTitle.font = { bold: true, size: 16, color: { argb: colors.titleRed } }
    strategyTitle.alignment = { horizontal: 'center', vertical: 'middle' }
    strategyTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.headerDark } }
    
    // Dati carburante
    strategySheet.getCell('A3').value = 'CONSUMO CARBURANTE'
    strategySheet.getCell('A3').font = { bold: true, color: { argb: colors.white } }
    strategySheet.getCell('A3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.headerGray } }
    
    strategySheet.getCell('A4').value = 'Consumo stimato:'
    strategySheet.getCell('B4').value = '2,65 L/giro'
    strategySheet.getCell('A5').value = 'Buffer sicurezza:'
    strategySheet.getCell('B5').value = '+2 L per stint'
    strategySheet.getCell('A6').value = 'Refuel rate:'
    strategySheet.getCell('B6').value = '9,5 L/s'
    strategySheet.getCell('A7').value = 'Pit stop base:'
    strategySheet.getCell('B7').value = '17,5 s'
    
    // Piano pit stop
    strategySheet.getCell('A9').value = 'PIANO PIT STOP'
    strategySheet.getCell('A9').font = { bold: true, color: { argb: colors.white } }
    strategySheet.getCell('A9').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.headerGray } }
    
    strategySheet.getCell('A10').value = 'Numero soste:'
    strategySheet.getCell('B10').value = 2
    strategySheet.getCell('A11').value = 'Stint 1:'
    strategySheet.getCell('B11').value = '40 L'
    strategySheet.getCell('A12').value = 'Stint 2:'
    strategySheet.getCell('B12').value = '38 L'
    strategySheet.getCell('A13').value = 'Stint 3:'
    strategySheet.getCell('B13').value = '35 L'
    strategySheet.getCell('A14').value = 'Compound:'
    strategySheet.getCell('B14').value = 'Medium'
    
    // Pit Loss Visualizer
    strategySheet.getCell('A16').value = 'PIT LOSS VISUALIZER'
    strategySheet.getCell('A16').font = { bold: true, color: { argb: colors.white } }
    strategySheet.getCell('A16').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.headerGray } }
    
    const pitLossData = [
      ['Carburante', 'Tempo aggiunto'],
      ['+0 L', '+0,0 s'],
      ['+5 L', '+0,5 s'],
      ['+10 L', '+1,0 s']
    ]
    
    pitLossData.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        const cell = strategySheet.getCell(rowIndex + 17, colIndex + 1)
        cell.value = value
        if (rowIndex === 0) {
          cell.font = { bold: true }
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.lightGray } }
        }
      })
    })
    
    // Formattazione colonne
    strategySheet.getColumn('A').width = 20
    strategySheet.getColumn('B').width = 15
    
    // 4. FOGLIO SIMULAZIONI
    const simulationsSheet = workbook.addWorksheet('Simulazioni')
    
    // Intestazione
    simulationsSheet.mergeCells('A1:F1')
    const simTitle = simulationsSheet.getCell('A1')
    simTitle.value = 'SIMULAZIONI STRATEGICHE'
    simTitle.font = { bold: true, size: 16, color: { argb: colors.titleRed } }
    simTitle.alignment = { horizontal: 'center', vertical: 'middle' }
    simTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.headerDark } }
    
    // Headers
    const simHeaders = ['Scenario', 'Pit Stop', 'Compound', 'Tempo Totale', 'Robustezza Meteo', 'Note']
    simHeaders.forEach((header, index) => {
      const cell = simulationsSheet.getCell(3, index + 1)
      cell.value = header
      cell.font = { bold: true, color: { argb: colors.white } }
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.headerGray } }
      cell.alignment = { horizontal: 'center' }
    })
    
    // Dati simulazioni
    const simData = [
      ['Scenario A', '2 pit', 'Medium', '5550,3 s', 'Buona', 'Strategia equilibrata'],
      ['Scenario B', '3 pit', 'Soft', '5539,8 s', 'Media', 'Migliore tempo - CONSIGLIATO'],
      ['Scenario C', '1 pit', 'Hard', '5602,4 s', 'Alta', 'Strategia conservativa']
    ]
    
    simData.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        const cell = simulationsSheet.getCell(rowIndex + 4, colIndex + 1)
        cell.value = value
        cell.alignment = { horizontal: 'center' }
        
        // Evidenzia scenario migliore in verde
        if (rowIndex === 1) { // Scenario B
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.successGreen } }
          cell.font = { bold: true }
        } else if (rowIndex % 2 === 0) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.lightGray } }
        }
      })
    })
    
    // Crossover Radar
    simulationsSheet.getCell('A8').value = 'CROSSOVER RADAR'
    simulationsSheet.getCell('A8').font = { bold: true, color: { argb: colors.white } }
    simulationsSheet.getCell('A8').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.headerGray } }
    
    simulationsSheet.getCell('A9').value = 'Finestra giri:'
    simulationsSheet.getCell('B9').value = '17-19'
    simulationsSheet.getCell('A10').value = 'Delta se tardi:'
    simulationsSheet.getCell('B10').value = '11,2 s'
    
    // Formattazione colonne
    simulationsSheet.columns.forEach(column => {
      column.width = 18
    })
    
    // 5. FOGLIO REPORT POST-GARA
    const reportSheet = workbook.addWorksheet('Report Post-gara')
    
    // Intestazione
    reportSheet.mergeCells('A1:F1')
    const reportTitle = reportSheet.getCell('A1')
    reportTitle.value = 'REPORT POST-GARA - ANALISI PERFORMANCE'
    reportTitle.font = { bold: true, size: 16, color: { argb: colors.titleRed } }
    reportTitle.alignment = { horizontal: 'center', vertical: 'middle' }
    reportTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.headerDark } }
    
    // Sezione dati reali
    reportSheet.getCell('A3').value = 'DATI REALI GARA'
    reportSheet.getCell('A3').font = { bold: true, color: { argb: colors.white } }
    reportSheet.getCell('A3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.headerGray } }
    
    const reportHeaders = ['Stint', 'Tempo Stint', 'Pit Effettuati', 'Litri Residui', 'Compound Usato', 'Note']
    reportHeaders.forEach((header, index) => {
      const cell = reportSheet.getCell(4, index + 1)
      cell.value = header
      cell.font = { bold: true }
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.lightGray } }
      cell.alignment = { horizontal: 'center' }
    })
    
    // Righe editabili con placeholder
    const placeholderData = [
      ['Stint 1', '[Inserire tempo]', '[Giro pit]', '[Litri rimasti]', '[Compound]', '[Note]'],
      ['Stint 2', '[Inserire tempo]', '[Giro pit]', '[Litri rimasti]', '[Compound]', '[Note]'],
      ['Stint 3', '[Inserire tempo]', '[Fine gara]', '[Litri rimasti]', '[Compound]', '[Note]']
    ]
    
    placeholderData.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        const cell = reportSheet.getCell(rowIndex + 5, colIndex + 1)
        cell.value = value
        cell.alignment = { horizontal: 'center' }
        if (rowIndex % 2 === 1) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.lightGray } }
        }
      })
    })
    
    // Sezione analisi
    reportSheet.getCell('A9').value = 'ANALISI AUTOMATICA'
    reportSheet.getCell('A9').font = { bold: true, color: { argb: colors.white } }
    reportSheet.getCell('A9').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.headerGray } }
    
    reportSheet.getCell('A10').value = 'Pit anticipato:'
    reportSheet.getCell('B10').value = 'Perdita stimata 12 s'
    reportSheet.getCell('A11').value = 'Consumo:'
    reportSheet.getCell('B11').value = 'Consumo sottostimato: rischio extra lap'
    
    // Formattazione colonne
    reportSheet.columns.forEach(column => {
      column.width = 16
    })
    
    // FOGLIO META (nascosto)
    const metaSheet = workbook.addWorksheet('Meta', { state: 'hidden' })
    metaSheet.getCell('A1').value = 'File demo generato automaticamente – valori simulati'
    metaSheet.getCell('A2').value = `Timestamp generazione: ${new Date().toLocaleString('it-IT')}`
    metaSheet.getCell('A3').value = 'GPRO Setup Tool MVP - Dimostrazione funzionalità'
    
    // Congela prima riga per tutti i fogli
    inputSheet.views = [{ state: 'frozen', ySplit: 1 }]
    setupSheet.views = [{ state: 'frozen', ySplit: 3 }]
    strategySheet.views = [{ state: 'frozen', ySplit: 1 }]
    simulationsSheet.views = [{ state: 'frozen', ySplit: 3 }]
    reportSheet.views = [{ state: 'frozen', ySplit: 4 }]
    
    // Genera il buffer del file Excel
    const buffer = await workbook.xlsx.writeBuffer()
    
    // Verifica dimensione file
    const fileSizeKB = buffer.byteLength / 1024
    console.log(`File Excel generato: ${fileSizeKB.toFixed(2)} KB`)
    
    // Verifica tempo di generazione
    const generationTime = Date.now() - startTime
    console.log(`Tempo di generazione: ${generationTime} ms`)
    
    // Imposta headers per download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', 'attachment; filename="GPRO_Setup_Demo.xlsx"')
    res.setHeader('Content-Length', buffer.byteLength)
    
    // Invia il file
    res.send(buffer)
    
  } catch (error) {
    console.error('Errore nella generazione del file Excel:', error)
    res.status(500).json({ 
      error: 'Errore interno del server durante la generazione del file Excel',
      details: error instanceof Error ? error.message : 'Errore sconosciuto'
    })
  }
}