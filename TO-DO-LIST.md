# <r>BUGLISTA
*EMPTY FOR NOW*

# <lb>NEED FOR 2.2 <o>**WIP**</o>

- [ ] Kompletny refaktoring kodu na Angular 17, przejście na model komponentowy (zwrócić szczególną uwagę na obsługę błędów)
    - [ ] Usunięcie zależności związanych z edycją BETA
    - [ ] **CORE**
        - [ ] Przenieść folder UI do feature
        - [ ] **SERVICES**
            - [ ] Refaktoring zgodnie z podejściem 
                    Komponent => Serwis strony => Serwis aplikacji/podmiotu
                - [ ] App 
                - [ ] Data
                    - [x] Car 
                    - [x] Car Brand
                    - [x] Route
                - [ ] State
                - [x] Apperance
                - [ ] Backup
                - [x] Validator 
            - [ ] Sprawdź poprawność działania serwisu walidatora
            - [ ] Ustandaryzuj działanie backupu w zakresie wersji i wczytywania danych backupu
    - [ ] **FEATURE**
        - [ ] Refaktoring zgodnie z podejściem 
                Komponent => Serwis strony => Serwis aplikacji/podmiotu
        - [ ] Rozbicie na mniejsze komponenty
            - [ ] About App
            - [ ] Important Update
            - [x] App First Configuration (Start Configuration)
            - [ ] Backup
            - [ ] Brand List
            - [ ] Brand Create
            - [ ] Car 
            - [ ] Routes List
            - [ ] Settings
            - [x] Splash Screen
        - [ ] Przepisanie HTML z optymalizacją CSS
            - [ ] UI
                - [x] Upper Bar <r>NAVIGATION FUN EMPTY</r>
                - [ ] Loading Screen
                - [ ] Navigation Bar
                - [ ] Warning Prompt
                - [ ] Loaders 
            - [ ] About App
            - [ ] Important Update
            - [x] App First Configuration (Start Configuration)
            - [ ] Backup
            - [ ] Brand List
            - [ ] Brand Create
            - [ ] Car 
            - [ ] Routes List
            - [ ] Settings
            - [x] Splash Screen
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
- [ ] Dodanie napisu wersji na ekranie startowym
- [ ] Wersjonowanie do wersji 2.1.4

# <g>FUTURE FEATURE

### <o>2.3
- Symulowanie ładowania auta
- Zmiana interfejsu dodawania tras i ładowania

### <o>2.4
- Synchronizacja danych aplikacji z serwerem backup, gdzie backup będzie bardziej zawansowany ponieważ podzielny na backup pełny jak i nie pełny
- Dodawanie auta bez zdjęcia, oznacza ona również zmianę wygląd interfejsu

### <o>2.5
- Historia auta, oznacza to zapisywane wszystkich tras auta i wyświetlanie różnych statystyk auta

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
