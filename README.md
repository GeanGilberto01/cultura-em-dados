# 🎭 Cultura em Dados

Uma aplicação web interativa desenvolvida em **React + TailwindCSS** para visualização de dados culturais brasileiros. O projeto apresenta informações relevantes sobre locais, eventos e hábitos culturais de diferentes regiões do país com base em um arquivo `.json` de dados estático.

[🔗 Acesse a versão online do projeto](https://geangilberto01.github.io/cultura-em-dados/)

---

## 📊 Funcionalidades

- 🌍 Mapa interativo com marcadores culturais (usando Leaflet)
- 📈 Gráficos dinâmicos com dados de participação por faixa etária e segmento (Chart.js)
- 🧭 Filtros geográficos e por tipo de evento
- 💃 Base de dados local em JSON (localizada na pasta `public/`)
- 💡 Interface moderna e responsiva com TailwindCSS

---

## 🛠️ Tecnologias Utilizadas

| Categoria       | Tecnologias                                                |
| --------------- | ---------------------------------------------------------- |
| **Linguagem**   | JavaScript (ES6+)                                          |
| **Framework**   | [React](https://reactjs.org/)                              |
| **Estilização** | [Tailwind CSS](https://tailwindcss.com/)                   |
| **Gráficos**    | [Chart.js](https://www.chartjs.org/) via `react-chartjs-2` |
| **Mapas**       | [Leaflet](https://leafletjs.com/) via `react-leaflet`      |
| **HTTP Client** | [Axios](https://axios-http.com/)                           |
| **Deploy**      | GitHub Pages                                               |

---

## 📁 Estrutura do Projeto

```
cultura-em-dados/
├── public/
│   └── locais_culturais.json       # Base de dados local
├── src/
│   ├── components/                 # Componentes reutilizáveis
│   ├── pages/                      # Páginas principais da aplicação
│   ├── assets/                     # Imagens, ícones, etc.
│   ├── App.jsx                     # Componente principal
│   └── index.js                    # Ponto de entrada do React
├── tailwind.config.js
├── package.json
└── README.md
```

---

## ▶️ Como Executar Localmente

> Pré-requisitos: Node.js (v18+) e npm

```bash
# Clone o repositório
git clone https://github.com/GeanGilberto01/cultura-em-dados.git
cd cultura-em-dados

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm start
```

A aplicação estará disponível em: `http://localhost:3000/`

---

## 🚀 Deploy

O deploy está configurado via GitHub Pages. Para publicar alterações:

```bash
npm run build
npm run deploy
```

> O site será publicado em: `https://geangilberto01.github.io/cultura-em-dados/`

---

## 📜 Licença

Este projeto está licenciado sob a Licença MIT.\
Consulte o arquivo [LICENSE](./LICENSE) para mais detalhes.

---

## 🙋‍♂️ Autor

Desenvolvido por **Gean Gilberto Coimbra**\
🔗 [LinkedIn](https://www.linkedin.com/in/gean-gilberto-coimbra)

---

## 💡 Sugestões Futuras (TODO)

-

---

