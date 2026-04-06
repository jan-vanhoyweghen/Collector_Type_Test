# Collector DNA Browser App

Statische browser-app gebouwd op basis van `agent.md`.

## Starten

1. Open `/Users/janvanhoyweghen/Desktop/Codex test/index.html` in je browser.
2. Voeg artworks toe in **Data Entry Module · Artwork Bibliotheek** (manueel of via scrape-link).
3. Selecteer in elk room-slot een artwork via **Selecteer uit bibliotheek**.
4. Kies het aantal objecten: **9**, **12** of **15**.
5. Scoor de 7 DNA-assen per gekozen object.
6. Klik op **Analyseer mijn DNA**.

## Wat de app doet

- Dwingt de Drie Kamers-methode af met een gelijke verdeling per kamer.
- Integreert een artwork-bibliotheek met afbeelding, titel, artist en bron.
- Bevat manuele, PDF- en scrape-invoer in de artwork-bibliotheek.
- Doet automatische PDF-tekstanalyse met titel/artist suggesties bij file-selectie.
- Kan meerdere kunstwerken uit één PDF detecteren en in bulk toevoegen.
- Ondersteunt toewijzing van artwork-afbeeldingen aan room-slots (Hart/Rede/Jacht).
- Synchroniseert scores automatisch over slots die hetzelfde artwork gebruiken (invullen 1x, weging blijft gelijk).
- Stuurt de gebruiker na artwork-selectie automatisch terug naar het juiste vragenblok (scroll + focus).
- Ondersteunt flexibele profieldiepte: 9 (3x3), 12 (3x4) of 15 (3x5) objecten.
- Laat invoer gebeuren per kamer via tabs en vorige/volgende navigatie.
- Verzamelt 7 DNA-assen per object (1-5 sliders).
- Toont per as een concrete vraag (met 1-click alternatieve formulering) i.p.v. alleen asnamen.
- Berekent gemiddelde as-scores over het gekozen aantal objecten.
- Matcht met 10 archetypen via Euclidische afstand.
- Past Shadow Profile-regels toe bij scores onder 1.8.
- Toont radar chart, archetype-uitleg, DNA-mix, status en JSON-output.
- Geeft kamergebaseerde validatiefeedback bij ontbrekende objectnamen.
- Slaat invoer automatisch op in browser-opslag en herstelt die bij herladen.
- Staat dubbele stuknamen toe; JSON `object_id` blijft technisch uniek met suffixen.

## Extra

- **Laad voorbeeldprofiel** vult demo-data in.
- **Reset formulier** zet alles terug op startwaarden.
