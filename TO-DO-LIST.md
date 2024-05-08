# <r>BUGLISTA
*EMPTY FOR NOW*

# <lb>NEED FOR 2.2 <o>**WIP**</o>
- [ ] Pełna obsługa błędów
    - [ ] UI od belki błędów
- [ ] Stworzenie skryptu sortującego błedy w pliku JSON jak i typach
- [ ] Sprawdzenie poprawności stylów i dark modu
    - [ ] About App
    - [ ] Important Update
    - [ ] App First Configuration (Start Configuration)
    - [ ] Backup
    - [ ] Brand List
    - [ ] Brand Create
    - [ ] Car 
    - [ ] Routes List
    - [ ] Settings
    - [ ] Splash Screen
- [ ] Symulowanie ładowania auta
- [ ] Zmiana interfejsu dodawania tras i ładowania
- [ ] Pamiętanie całej historii auta

# <lb>DONE IN 2.2

- [x] <r>**Refaktoring modeli na null gdy pusty wyraz** </r>
- [x] Kompletny refaktoring kodu na Angular 17, przejście na model komponentowy
    - [x] **CORE**
        - [x] **SERVICES**
            - [x] Refaktoring zgodnie z podejściem 
                    Komponent => Serwis strony => Serwis aplikacji/podmiotu
                - [x] App 
                - [x] Data
                    - [x] Car 
                    - [x] Car Brand
                    - [x] Route
                - [x] Apperance
                - [x] Backup
                - [x] Validator 
            - [x] Sprawdź poprawność działania serwisu walidatora
            - [x] Ustandaryzuj działanie backupu w zakresie wersji i wczytywania danych backupu
    - [x] **FEATURE**
        - [x] Refaktoring zgodnie z podejściem 
                Komponent => Serwis strony => Serwis aplikacji/podmiotu
        - [x] Rozbicie na mniejsze komponenty
            - [x] About App
            - [x] Important Update
            - [x] App First Configuration (Start Configuration)
            - [x] Backup
            - [x] Brand List
            - [x] Brand Create
            - [x] Car Create
            - [x] Car List 
            - [x] Routes List
            - [x] Settings
            - [x] Managed App Data
            - [x] Splash Screen
        - [x] Przepisanie HTML z optymalizacją CSS
            - [x] UI
                - [x] Upper Bar
                - [x] Loading Screen
                - [x] Navigation Bar
                - [x] Loaders 
            - [x] About App
            - [x] Important Update
            - [x] App First Configuration (Start Configuration)
            - [x] Backup
            - [x] Brand List
            - [x] Brand Create
            - [x] Car List
            - [x] Car Create
            - [x] Home Page 
            - [x] Routes List
            - [x] Settings
            - [x] Managed App Data
            - [x] Splash Screen
- [x] Dodanie napisu wersji na ekranie startowym

# <g>FUTURE FEATURE

### <o>2.3
- Synchronizacja danych aplikacji z serwerem backup, gdzie backup będzie bardziej zawansowany ponieważ podzielny na backup pełny jak i nie pełny
- Dodawanie auta bez zdjęcia, oznacza ona również zmianę wygląd interfejsu

# <gr>WERSJONOWANIE

### <gr>G.W.P (DDDDDDL)

<gr>G - Główna edycja aplikacji<br>
W - Duza zmiana w aplikacji<br>
P - Poprawka w aplikacji<br>
D - Data kompilacji w formacie (Rok-Miesiąc-Dzień)<br>
L - Litera jako numer kompilacji w danym D<br>

<style>
r { color: Red }
o { color: Orange }
g { color: Green }
lb { color: Lightblue }
gr { color: gray }
dg { color: DarkGreen }
db { color: Darkblue}
</style>
