# quickhireup-front

# Instrukcja instalacji projektu QuickHireUP

Poniżej znajduje się lista kroków wymaganych do poprawnego uruchomienia systemu.

### 1. Wymagania systemowe

- **System operacyjny** - Windows 10 lub 11
- **Środowisko .NET** - .NET 8.0 SDK
- **Środowisko Node.js** - Wersja 22.x lub nowsza
- **Node Packet Manager** - npm wersja 10.x lub nowsza
- **Baza danych** - MariaDB 10.11.15 lub nowsza
- **Przeglądarka** - np. Chrome

### 2. Wymagania sprzętowe

- **Procesor** - minimum 2-rdzeniowy
- **Pamięć RAM** - minimum 8 GB
- **Miejsce na dysku** - 1 GB

### 3. Konfiguracja bazy danych

- Uruchom instancję serwera bazy danych
- Utwórz pustą bazę danych o dowolnej nazwie
- W pliku appsettings.json zaktualizuj sekcję “ConnectionStrings”

### 4. Instalacja i uruchomienie Backend .NET 8

- Sklonuj repozytorium
  - `git clone https://github.com/Symii/quickhireup-api.git`
- Wejdź do katalogu quickhireup-api
- Wpisz komendy
  - `dotnet restore`
  - `dotnet ef database update`
  - `dotnet run`

### 5. Konfiguracja OpenAI

- Przejdź na platformę OpenAI https://platform.openai.com/
- Zaloguj się lub utwórz konto.
- Utwórz nowy api key https://platform.openai.com/api-keys
- Po utworzeniu od razu skopiuj token i wklej do appsettings.json do sekcji OpenAI.
- Po utworzeniu konta powinny być do wykorzystania darmowe tokeny, jeśli zostaną zużyte, będzie wymagane doładowania konta.

### 6. Konfiguracja poczty e-mail (Przykład Gmail)

- Zaloguj się lub utwórz konto gmail https://accounts.google.com/signin
- Włącz weryfikację dwuetapową.
- Wygeneruj hasło do aplikacji https://myaccount.google.com/apppasswords
- Skopiuj 16-znakowy kod (bez spacji) do appsettings.json do sekcji EmailSettings.

### 7. Instalacja i uruchomienie Frontend (Vue 3)

- Sklonuj repozytorium
  - `git clone https://github.com/Symii/quickhireup-front.git`
- Wejdź do katalogu quickhireup-front
- Zaktualizuj plik `.env` (ustaw adres URL dla backendu / API)
- Wpisz komendy
  - `npm install`
  - `npm run dev`

### 8. Weryfikacja instalacji

- Pod adresem `http://localhost:port` (podaj właściwy port) powinien wyświetlać się interfejs użytkownika.
- Aplikacja powinna pobierać dane z bazy danych przez API.
