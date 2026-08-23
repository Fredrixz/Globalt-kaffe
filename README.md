# Globalt kaffe

Skoluppgift i Node.js/blockchain. Ett litet API som håller koll på kaffepartier (gård → rosteri → kafé) i en enkel blockkedja med Proof-of-Work, så att ingen kan smyga in fejkade transaktioner i efterhand.

## Köra igång

```bash
npm install
npm start          # kör på localhost:3000
npm test           # vitest + supertest
npm run coverage
```

## Endpoints

- `GET /blockchain` – hela kedjan
- `POST /transactions` – lägger till en transaktion (`{ sender, recipient, batchId, weightKg }`), avvisar med 400 om nåt fält saknas
- `POST /mine` – minar alla väntande transaktioner till ett nytt block

## Hur det hänger ihop

`Block` (block.js) räknar ut sin egen hash med `crypto`/SHA-256, och `mineBlock()` kör en while-loop som ökar `nonce` tills hashen börjar med rätt antal nollor (det är själva Proof-of-Work-biten).

`Blockchain` (blockchain.js) håller kedjan + en lista med väntande transaktioner, och har `minePendingTransactions()` som bygger nästa block och `isChainValid()` som kollar att ingen pillat i historiken (jämför varje blocks hash mot en omräkning, och att previousHash stämmer med föregående block).

Svårighetsgraden är satt till 1 när `NODE_ENV === 'test'` (annars hade testerna kunnat ta för lång tid pga mining-loopen), annars 2 via en `DIFFICULTY`-miljövariabel om man vill skruva på den.

## TDD

Testerna för hash/mining skrevs innan koden fanns. Några exempel där man ser röd-commit → grön-commit:

- mineBlock (PoW): [röd](https://github.com/Fredrixz/Globalt-kaffe/commit/c1866d6) → [grön](https://github.com/Fredrixz/Globalt-kaffe/commit/1c11d52)
- minePendingTransactions: [röd](https://github.com/Fredrixz/Globalt-kaffe/commit/e1becc4) → [grön](https://github.com/Fredrixz/Globalt-kaffe/commit/ccdb6a1)
- isChainValid: [röd](https://github.com/Fredrixz/Globalt-kaffe/commit/ac1d434) → [grön](https://github.com/Fredrixz/Globalt-kaffe/commit/8fd2a4c)

Coverage ligger på 100% just nu (`npm run coverage`).
