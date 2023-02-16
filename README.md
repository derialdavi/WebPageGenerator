# WebPageGenerator
WebPageGenerator è un sito che permette all'utente di modifcare un json contenente le informazioni di una pagina web. Le informazioni verranno sostituite ad un template html.

## Esempio JSON
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
            "paragrafo": "paragrafo sezione 1",
            "img": "muro.jpg"
        },
        {
            "titolo": "Sezione 2",
            "paragrafo": "paragrafo sezione 2",
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
