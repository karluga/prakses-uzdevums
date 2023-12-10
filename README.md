<img src="https://res.cloudinary.com/practicaldev/image/fetch/s--eFpINR9o--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5c9mxgm5czaxntrvfgaq.png" alt="React Icon" height="100">

> # Driving route report system <sup><sub>EN</sub></sup>

This is a small project using the [Mapon API](https://mapon.com/api/) and [Google Maps API](https://developers.google.com/maps/documentation/routes)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- [Node.js](https://nodejs.org/) installed, comes with npm (node package manager)
- [Git](https://git-scm.com/) installed

## Clone the Repository
```
git clone https://github.com/karluga/prakses-uzdevums.git
```
## Navigate to the Project Directory
```
cd your-project/frontend
```
## Install Dependencies
```
npm install
```
### List of Dependencies

- react
- react-router-dom
- react-datepicker
- axios
- @react-google-maps/api
- react-icons
- xlsx

## Configure API Keys

1. Get API keys for the following services:
   - [Google Maps API](https://developers.google.com/maps/documentation/routes)
   - [Mapon API](https://mapon.com/api/)

2. Replace the placeholder API keys in your project:

   - Open the file `.env` in the frontend directory.

   - Replace the placeholder values with your actual API keys:
      ```
     REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
     REACT_APP_MAPON_API_KEY=your-mapon-api-key
      ```

## Run the Application
```
npm start
```
Access the application at http://localhost:8000 :grinning:

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

**Free to use!**

<br>

> # Braukšanas maršruta ziņojumu sistēma <sup><sub>LV</sub></sup>

Šis ir neliels projekts, izmantojot [Mapon API](https://mapon.com/api/) un [Google Maps API](https://developers.google.com/maps/documentation/routes).

## Priekšnosacījumi

Pirms sākat, pārliecinieties, vai esat ir izpildīti šādi priekšnosacījumi:

- Instalēts [Node.js](https://nodejs.org/), nāk līdzi ar npm (node package manager)
- Instalēts [Git](https://git-scm.com/)

## Izveidojiet arhīva dublējumkopiju
```
git clone https://github.com/karluga/prakses-uzdevums.git
```
## Navigējiet uz projektu
```
cd your-project/frontend
```
## Instalējiet papildinājumus no kuriem programma ir atkarīga
```
npm install
```
### Papildinājumu saraksts

- react
- react-router-dom
- react-datepicker
- axios
- @react-google-maps/api
- react-icons
- xlsx

## Konfigurējiet API atslēgas

1. Iegūstiet API atslēgas šādiem pakalpojumiem:
   - [Google Maps API](https://developers.google.com/maps/documentation/routes)
   - [Mapon API](https://mapon.com/api/)

2. Aizstājiet API piekļuves atslēgas:

   - Atveriet failu `.env` frontend mapē.

   - Aizstājiet piemēru vērtības ar jūsu API atslēgām:
      ```
     REACT_APP_GOOGLE_MAPS_API_KEY=jūsu-google-maps-api-atslēga
     REACT_APP_MAPON_API_KEY=jūsu-mapon-api-atslēga
      ```
   
## Palaidiet lietotni
```
npm start
```
Lietotnei var piekļūt vietnē http://localhost:3000 :grinning:

## Licence

Šis projekts ir licencēts saskaņā ar MIT licenci - skatiet [LICENSE.md](LICENSE.md) failu, lai iegūtu detalizētāku informāciju.

**Brīva lietošana!**
