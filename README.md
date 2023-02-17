# WebPageGenerator
WebPageGenerator è un sito che permette all'utente di modifcare un json contenente le informazioni di una pagina web. Le informazioni verranno sostituite ad un template html.

## Guida per la configurazione del JSON
Il JSON che deve essere mandato al server deve avere delle informazioni di base obbligatorie e poi possono essere aggiunte informazioni aggiuntive come immagini o liste.

Il nome del progetto verrà preso automaticamente dal nome del file JSON selezionato

### Titolo, Proprietario, indirizzo, email, numero_di_telefono
`"Titolo"`, `"Proprietario"` `"indirizzo"`, `"email"` e `"numero_di_telefono"` sono dei campi che vanno semplicemente inseriti all'interno dell'oggetto e che contengono il valore rispettivamente del titolo della finestra del browser, del proprietario del sito, dell'indirizzo della sede, dell'indirizzo email e del numero di telefono.

### header
Nell'oggetto `"header"` sono contenuti due valori:
- titolo
- sottotitolo

Questi due campi verranno stampati all'inizio della pagina e sono il nome e la descrizione del progetto che state creando

### sections
Il campo `"sections"` è di base una lista con all'interno 1 oggetto che contiene almeno un `"titolo"` e un `"paragrafo"`, che servono a descrivere quella sezione.

Per ogni sezione posso essere aggiunte un immagine o delle liste. Per inserire un immagine bisogna aggiungere la chiave `"img"` e come valore mettere il nome del file. Per inserire delle liste bisogna aggiungere la chiave `"liste"`, che deve essere una lista, che all'interno contenga tanti oggetti quante liste si vogliono fare. Ogni oggetto della lista avrà come chiave il nome della lista e come valore una lista contenente gli elementi di essa.

> Possono essere aggiunte quante sezioni si vogliono.

## Esempio di JSON
```
{
    "Titolo": "Lorem ipsum",
    "Proprietario": "Ficars",
    "header": {
        "titolo": "FICARRA",
        "sottotitolo": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    "sections": [
        {
            "titolo": "Sezione 1",
            "paragrafo": "Paragrafo sezione 1",
            "img": "muro.jpg"
        },
        {
            "titolo": "Sezione 2",
            "paragrafo": "Paragrafo sezione 2",
            "liste": [
                {
                    "lista1": [
                        "C",
                        "C#",
                        "C++",
                        "Java"
                    ],
                    "lista2": [
                        "JavaScript",
                        "Python"
                    ]
                }
            ],
            "img": "luna.jpg"
        }
    ],
    "indirizzo":"via ... n.civico",
    "email":"dade.carra@gmail.com",
    "numero_di_telefono":"+39 1234567890"
}
```
