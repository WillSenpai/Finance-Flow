# Learnings

---

## 1. Tool Reliability Index

| Tool | Status | Failure Mode | Workaround |
|------|--------|--------------|------------|

---

## 2. Errori Noti per Direttiva

### UI Consistency

- **Desktop vs Mobile Grid**: Su `AdminAccademia.tsx` l'utilizzo di griglie rigide su root container senza breakpoint responsivi porta ad accordion e form estesi non compatti. Soluzione: Usare `lg:grid-cols-[1fr,260px]` e agrupare macro sezioni.

---

## 3. Log Cronologico

### [2026-03-05] Gestione Accademia Layout / UI Consistency

**Problema:** L'interfaccia dell'editor lezioni (Gestione Accademia) era eccessivamente allungata verticalmente su mobile, con spazi non ottimizzati e form dispersi.
**Causa:** Container singoli impilati verticalmente, pulsanti d'azione editor ingombranti e "Checklist struttura" spinta in fondo alla pagina o in logiche `md:`. (categoria: UI/UX Layout)
**Fix:** Compatto della sezione raggruppando `Titolo lezione` e `Macrosezione` in riga (`sm:grid-cols-2`). Spostato "Immagine card" assieme alla "Checklist struttura" su colonna dedicata `lg:grid-cols-[1fr,260px]` visibile su desktop/tablet riducendo vertical space su mobile. Pulsanti editor aggregati con stili nativi (`bg-muted/50`).
**Stato:** ✅ Completato
**Confidence:** Alta

