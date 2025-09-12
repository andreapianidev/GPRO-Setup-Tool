# Guida per Contributor 🤝

Grazie per il tuo interesse nel contribuire al GPRO Setup Tool! Questa guida ti aiuterà a iniziare.

## 🎯 Come Contribuire

### Tipi di Contributi Benvenuti

1. **🧮 Algoritmi GPRO Reali**
   - Implementazione calcoli setup ottimali
   - Formule per strategia gara
   - Algoritmi di analisi performance

2. **🎨 Miglioramenti UI/UX**
   - Design componenti
   - Esperienza utente
   - Responsive design

3. **⚡ Ottimizzazioni Performance**
   - Velocità generazione Excel
   - Ottimizzazione bundle
   - Caching intelligente

4. **🧪 Testing**
   - Unit tests
   - Integration tests
   - E2E tests

5. **📚 Documentazione**
   - Guide utente
   - Documentazione API
   - Tutorial

## 🚀 Setup Sviluppo

### 1. Fork e Clone
```bash
# Fork del repository su GitHub
# Poi clona il tuo fork
git clone https://github.com/TUO-USERNAME/gpro-setup-tool.git
cd gpro-setup-tool
```

### 2. Installazione
```bash
# Installa dipendenze
npm install

# Avvia sviluppo
npm run dev
```

### 3. Configurazione IDE
- **VSCode**: Installa le estensioni consigliate
- **TypeScript**: Abilita strict mode
- **ESLint**: Segui le regole del progetto
- **Prettier**: Formattazione automatica

## 📋 Process di Sviluppo

### 1. Scegli un Issue
- Controlla gli [Issues aperti](https://github.com/your-username/gpro-setup-tool/issues)
- Commenta per assegnarti il task
- Chiedi chiarimenti se necessario

### 2. Crea un Branch
```bash
# Crea branch dalla main
git checkout -b feature/nome-feature

# Oppure per bug fix
git checkout -b fix/nome-bug
```

### 3. Sviluppa
- Scrivi codice pulito e commentato
- Segui le convenzioni esistenti
- Aggiungi test se necessario

### 4. Test
```bash
# Esegui tutti i test
npm test

# Test specifici
npm test -- --watch

# Build di produzione
npm run build
```

### 5. Commit
```bash
# Commit con messaggio descrittivo
git add .
git commit -m "feat: aggiungi calcolo setup ottimale"

# Oppure per bug fix
git commit -m "fix: correggi generazione Excel su Safari"
```

### 6. Pull Request
- Push del branch al tuo fork
- Apri PR verso il repository principale
- Descrivi le modifiche nel dettaglio
- Collega agli Issues rilevanti

## 🎨 Convenzioni Codice

### TypeScript
```typescript
// ✅ Buono
interface SetupCalculation {
  driverId: string;
  carId: string;
  trackId: string;
  weather: WeatherConditions;
}

// ❌ Evita
const calc = (d: any, c: any) => {
  // logica non tipizzata
};
```

### React Components
```tsx
// ✅ Buono
interface SetupFormProps {
  onSubmit: (data: SetupData) => void;
  loading?: boolean;
}

export function SetupForm({ onSubmit, loading = false }: SetupFormProps) {
  // implementazione
}

// ❌ Evita
export default function Form(props: any) {
  // implementazione
}
```

### Styling
```tsx
// ✅ Usa Tailwind CSS
<div className="bg-blue-500 text-white p-4 rounded-lg">
  Content
</div>

// ❌ Evita CSS inline
<div style={{ backgroundColor: 'blue', color: 'white' }}>
  Content
</div>
```

## 🧮 Implementazione Algoritmi GPRO

### Struttura Calcoli
```typescript
// Esempio struttura per calcoli setup
export interface SetupCalculator {
  calculateOptimalSetup(params: SetupParams): SetupResult;
  calculateLapTime(setup: CarSetup, conditions: RaceConditions): number;
  calculateTyreWear(setup: CarSetup, laps: number): TyreWearResult;
}
```

### Dati Necessari
- **Piloti**: Skill, esperienza, preferenze
- **Auto**: Caratteristiche tecniche, setup range
- **Piste**: Layout, curve, rettilinei
- **Meteo**: Temperatura, pioggia, vento

### Formule da Implementare
1. **Setup Ottimale**: Bilanciamento aero/meccanico
2. **Strategia Gomme**: Compound e pit stop
3. **Consumo Carburante**: Calcolo rifornimenti
4. **Tempi Giro**: Predizione performance

## 🧪 Testing Guidelines

### Unit Tests
```typescript
// Esempio test per calcoli
describe('SetupCalculator', () => {
  it('should calculate optimal setup for dry conditions', () => {
    const calculator = new SetupCalculator();
    const result = calculator.calculateOptimalSetup({
      driver: mockDriver,
      car: mockCar,
      track: mockTrack,
      weather: { condition: 'dry', temperature: 25 }
    });
    
    expect(result.frontWing).toBeGreaterThan(0);
    expect(result.rearWing).toBeGreaterThan(0);
  });
});
```

### Integration Tests
```typescript
// Test API endpoints
describe('Excel Generation API', () => {
  it('should generate valid Excel file', async () => {
    const response = await request(app)
      .get('/api/excel/generate-setup')
      .expect(200)
      .expect('Content-Type', /excel/);
    
    expect(response.body).toBeDefined();
  });
});
```

## 📚 Documentazione

### Code Comments
```typescript
/**
 * Calcola il setup ottimale per le condizioni specificate
 * @param params - Parametri di input (pilota, auto, pista, meteo)
 * @returns Setup ottimizzato con valori per tutti i componenti
 */
export function calculateOptimalSetup(params: SetupParams): SetupResult {
  // implementazione
}
```

### README Updates
- Aggiorna la documentazione per nuove feature
- Includi esempi di utilizzo
- Mantieni aggiornata la roadmap

## 🏆 Riconoscimenti

Tutti i contributor saranno riconosciuti:
- Nome nel README.md
- Badge contributor su GitHub
- Menzione nei release notes

## 📞 Supporto

- **Issues**: Per bug e feature request
- **Discussions**: Per domande generali
- **Discord**: [Link al server] (se disponibile)
- **Email**: andrea@andreapiani.com

## 📄 Licenza

Contribuendo al progetto, accetti che i tuoi contributi siano rilasciati sotto la licenza MIT del progetto.

---

**Grazie per contribuire al GPRO Setup Tool! 🏎️**