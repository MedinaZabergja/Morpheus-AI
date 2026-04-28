# 🎤 Morpheus AI – Demo Plan (5–7 min)

## 🧭 1. Çka është projekti dhe kujt i shërben (≈ 1 min)

Morpheus AI është një aplikacion web që ndihmon përdoruesit të:
- regjistrojnë ëndrrat e tyre
- marrin analiza nga AI për kuptimin e tyre
- ruajnë historikun personal të ëndrrave

🎯 Target audience:
- studentë
- persona që janë kurioz për kuptimin e ëndrrave
- persona që duan vetë-reflektim dhe përmirësim personal

💡 Vlera kryesore:
- kombinon journaling + AI analysis
- ofron insights personale në mënyrë automatike
- ruan të dhënat në mënyrë private për çdo user

---

## 🔁 2. Flow kryesor që do të demonstroj (≈ 3 min)

Gjatë demos do të ndjek këtë flow:

1. Login në aplikacion
2. Hap dashboard-in (Dream Journal)
3. Shtoj një ëndërr të re
4. Klikoj “Analyze”
5. AI gjeneron interpretimin e ëndrrës
6. Refresh page → tregoj që data ruhet në database
7. Hap një ëndërr nga historiku (Dream Detail View)
8. (Opsional) tregoj Sleep Help feature

🎯 Ky flow tregon:
- AI working
- Database persistence
- Auth functioning
- UI/UX flow

---

## ⚙️ 3. Pjesët teknike që do t’i shpjegoj shkurt (≈ 1–2 min)

Gjatë prezantimit do të përmend:

- Frontend: Next.js + Tailwind CSS
- Backend / Database: Supabase
- Authentication: Supabase Auth
- AI Integration:
  - Hugging Face API (model për analizë ëndrrash)

🔐 Siguria:
- Row Level Security (RLS) → çdo user sheh vetëm të dhënat e veta

💾 Data Flow:
User input → AI API → rezultat → ruhet në database → shfaqet në UI

---

## ✅ 4. Çfarë kam kontrolluar para demos (≈ 30–45 sec)

Para prezantimit kam testuar:

✔ AI kthen përgjigje për input normal  
✔ Input bosh nuk lejohet  
✔ Error handling në rast API failure  
✔ Database ruan të dhënat pas refresh  
✔ Login / Logout funksionon  
✔ Vetëm user-i sheh të dhënat e veta (RLS)  
✔ UI nuk crash-on në edge cases  

---

## 🚨 5. Plan B nëse live demo dështon (≈ 30–45 sec)

Nëse ndodh ndonjë problem me live demo:

- Kam screenshots të:
  - AI response
  - Database entries
  - Login flow
- Kam video të shkurtër të flow-it
- Mund të shpjegoj kodin dhe arkitekturën
- Mund të tregoj repo-n në GitHub

🎯 Qëllimi: të dëshmoj që sistemi funksionon edhe nëse demo live dështon

---

## 🧠 6. Organizimi i prezantimit

Struktura:

1. Intro (çka është projekti)
2. Demo live (flow kryesor)
3. Shpjegim teknik i shkurtër
4. Përfundim (vlera e projektit)

⏱ Total: 5–7 minuta

---

## 🎯 Përfundim

Morpheus AI është një aplikacion funksional që kombinon:
- AI
- database reale
- authentication

dhe ofron një eksperiencë të plotë për përdoruesin.

Projekti është testuar, stabil dhe gati për prezantim.