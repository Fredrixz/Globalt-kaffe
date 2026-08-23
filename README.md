# Globalt kaffe – decentraliserad logistikliggare

Ett backend-API (Node.js + Express) som spårar kaffepartier från gård till rosteri till kafé i en egen blockkedja, skyddad av en Proof-of-Work-hashningsmekanism. Byggt för att ett globalt kooperativ av kaffeodlare ska kunna lita på leveranshistoriken utan en central mellanhand.

## Kom igång

```bash
npm install
npm start          # startar servern på http://localhost:3000
npm test           # kör alla enhets- och integrationstester (Vitest + Supertest)
npm run coverage   # kör testerna med code coverage-rapport
```

## Arkitektur

- **`block.js`** – `Block`-klassen: `index`, `timestamp`, `transactions`, `previousHash`, `nonce`, `hash`. `calculateHash()` använder Nodes `crypto`-modul (SHA-256). `mineBlock(difficulty)` kör Proof-of-Work: en while-loop som ökar `nonce` tills hashen börjar med rätt antal nollor.
- **`blockchain.js`** – `Blockchain`-klassen: håller `chain` (färdiga block) och `pendingTransactions` (väntande transaktioner). Metoder: `addTransaction()`, `minePendingTransactions()` (skapar och minar nästa block dynamiskt, hårdkodar aldrig block), `isChainValid()`, `getLatestBlock()`.
- **`validateTransaction.js`** – Express-middleware som avvisar transaktioner som saknar `sender`, `recipient`, `batchId` eller `weightKg`.
- **`app.js`** – kopplar ihop Express-routes med en `Blockchain`-instans.

## API

| Metod | Endpoint          | Beskrivning                                                                 |
|-------|-------------------|------------------------------------------------------------------------------|
| GET   | `/blockchain`      | Returnerar hela kedjan.                                                     |
| POST  | `/transactions`    | Validerar och lägger till en transaktion i `pendingTransactions`.           |
| POST  | `/mine`            | Minar alla väntande transaktioner till ett nytt block, tömmer poolen.       |

Transaktionsformat: `{ sender, recipient, batchId, weightKg }`

## Proof-of-Work och svårighetsgrad

Svårighetsgraden styrs via miljövariabler så att testerna går snabbt men produktionsmiljön har en riktig utmaning:

- `NODE_ENV === 'test'` → svårighetsgrad **1** (Vitest sätter detta automatiskt, så testsviten minar block direkt utan att riskera timeout)
- annars → `process.env.DIFFICULTY` om satt, annars svårighetsgrad **2**

Se `resolveDifficulty()` i [`blockchain.js`](blockchain.js).

## `isChainValid()`

Loopar igenom kedjan från block 1 och kontrollerar för varje block:

1. Stämmer `currentBlock.hash` fortfarande om den räknas om?
2. Stämmer `currentBlock.previousHash` med föregående blocks `hash`?

Om något av detta failar returneras `false`, annars `true`.

## TDD: test-först, sedan kod

Hash- och mining-logiken byggdes med en strikt röd→grön-process: testet skrevs och committades först (och kördes för att bekräfta att det failade), därefter implementerades produktionskoden i en separat commit. Exempel ur historiken:

1. **Block.mineBlock (Proof-of-Work)**
   - 🔴 Röd: [Test för Block med transactions, nonce och mineBlock](https://github.com/Fredrixz/Globalt-kaffe/commit/c1866d6)
   - 🟢 Grön: [Implementera Block med mineBlock (SHA-256 PoW)](https://github.com/Fredrixz/Globalt-kaffe/commit/1c11d52)

2. **Blockchain.minePendingTransactions (mining)**
   - 🔴 Röd: [Test för minePendingTransactions](https://github.com/Fredrixz/Globalt-kaffe/commit/e1becc4)
   - 🟢 Grön: [Implementera minePendingTransactions med PoW-mining](https://github.com/Fredrixz/Globalt-kaffe/commit/ccdb6a1)

3. **Blockchain.isChainValid**
   - 🔴 Röd: [Test för isChainValid](https://github.com/Fredrixz/Globalt-kaffe/commit/ac1d434)
   - 🟢 Grön: [Implementera isChainValid](https://github.com/Fredrixz/Globalt-kaffe/commit/8fd2a4c)

4. **Blockchain-konstruktorn (genesis-block, difficulty)**
   - 🔴 Röd: [Test för Blockchain-konstruktor och getLatestBlock](https://github.com/Fredrixz/Globalt-kaffe/commit/87e388a)
   - 🟢 Grön: [Implementera Blockchain-konstruktor med genesis-block](https://github.com/Fredrixz/Globalt-kaffe/commit/35c0ad7)

5. **Blockchain.addTransaction**
   - 🔴 Röd: [Test för addTransaction](https://github.com/Fredrixz/Globalt-kaffe/commit/e18c439)
   - 🟢 Grön: [Implementera addTransaction](https://github.com/Fredrixz/Globalt-kaffe/commit/cc49838)

## Testning

- **Enhetstester** (`block.test.js`, `blockchain.test.js`, `add.test.js`): hashberäkning, determinism, mining/Proof-of-Work, `isChainValid`, difficulty via miljövariabler.
- **Integrationstester** (`app.test.js`, via Supertest): `GET /blockchain`, `POST /transactions` (inklusive avvisning av ogiltig indata), `POST /mine`.
- **Code coverage:** 100 % statements/branches/functions/lines (`npm run coverage`).
