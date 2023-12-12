<img src="https://res.cloudinary.com/practicaldev/image/fetch/s--eFpINR9o--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5c9mxgm5czaxntrvfgaq.png" alt="React Icon" height="100">

 # Driving route report system <sup><sub>EN</sub></sup>

This is a small project using the [React.js](https://react.dev/) JavaScript framework and two API's:
[Mapon API](https://mapon.com/api/) and [Google Maps API](https://developers.google.com/maps/documentation/routes)

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

<img src="https://brandslogos.com/wp-content/uploads/images/large/php-logo.png" alt="PHP Icon" height="50">
<img src="https://www.freeiconspng.com/thumbs/plus-icon/plus-icon-black-2.png" alt="Plus" height="50">
<img src="https://upload.wikimedia.org/wikipedia/labs/8/8e/Mysql_logo.png" alt="MySQL Icon" height="50">

## Back-end setup
The back-end is built using a MySQL database and vanilla PHP.
### To get it running
1. Have any local Apache and MySQl server software installed on your computer. Personally, i used WampServer, because i use Windows. I suggest to use [Laragon](https://laragon.org/download/index.html).
2. Drag the `backend` folder in the folder that hosts all the web files, in my case `www`
3. Turn on both Apache and MySQL servers
4. Create a database called `mapon_db` or give it any other name, just make sure it matches in the `backend/config.ini` file. Same goes for the other credentials `user` and `pass`.
5. Import the data from `backend/accounts.sql` file to create a table and get sample data.
6. In the `frontend/src/pages/Login.js` file change the path to the back-end server, if it is different from this: `http://localhost/backend/`.
After all that, the back-end is already usable from the front-end

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

**Free to use!**

<br>

 # Braukšanas maršruta ziņojumu sistēma <sup><sub>LV</sub></sup>

Šis ir neliels projekts, izmantojot [React.js](https://react.dev/) ietvaru un divas lietojumprogrammu saskarnes:
[Mapon API](https://mapon.com/api/) un [Google Maps API](https://developers.google.com/maps/documentation/routes).

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

<img src="https://brandslogos.com/wp-content/uploads/images/large/php-logo.png" alt="PHP Icon" height="50">
<img src="https://www.freeiconspng.com/thumbs/plus-icon/plus-icon-black-2.png" alt="Plus" height="50">
<img src="https://upload.wikimedia.org/wikipedia/labs/8/8e/Mysql_logo.png" alt="MySQL Icon" height="50">

## Aizmugursistēmas iestatīšana
Aizmugursistēma ir veidota, izmantojot MySQL datu bāzi un parasto PHP.
### Lai tas darbotos
1. Datorā instalējiet jebkuru lokālo Apache un MySQL servera programmatūru. Personīgi izmantoju WampServer, jo lietoju Windows. Iesaku izmantot [Laragon] (https://laragon.org/download/index.html).
2. Ielieciet mapi `backend` mapē, kurā tiek pasniegti visi tīmekļa faili, manā gadījumā — `www`
3. Ieslēgt gan Apache, gan MySQL serverus
4. Izveidojiet datu bāzi ar nosaukumu `mapon_db` vai izdomājiet tai citu nosaukumu un pārliecinieties, vai tā atbilst failam `backend/config.ini`. Tas pats attiecas uz citiem akreditācijas datiem `user` un `pass`.
5. Importējiet datus no faila `backend/accounts.sql`, lai izveidotu tabulu un iegūtu parauga datus.
6. Failā `frontend/src/pages/Login.js` mainiet ceļu uz aizmugursistēmas serveri, ja tas atšķiras no šī: `http://localhost/backend/`.
Kad viss ir izdarīts, aplikācijas front-end daļa varēs piekļūt back-end daļai.

## Licence

Šis projekts ir licencēts saskaņā ar MIT licenci - skatiet [LICENSE.md](LICENSE.md) failu, lai iegūtu detalizētāku informāciju.

**Brīva lietošana!**
