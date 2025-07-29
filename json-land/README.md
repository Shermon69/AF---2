#  JSON LAND

**JSON LAND** is a React-based web application built for the **Application Frameworks (AF) Assignment 2**. It allows users to explore country data from the [REST Countries API](https://restcountries.com/) with features like search, filter, detailed views, user registration, login, and favorites. The UI is styled with Tailwind CSS and authentication is simulated using LocalStorage.

**Live Demo**: [https://af-2-fesw-shermons-projects.vercel.app/login](https://af-2-fesw-shermons-projects.vercel.app/login)

---

## Features

- **User Authentication**: Register/login with username, email, password, and profile photo (stored in LocalStorage).
- **Country Browsing**: View countries with flags, capitals, and populations.
- **Search & Filter**: Find countries by name, region, or language with optimized debounce.
- **Country Details**: View capital, region, subregion, population, languages, currencies, and timezones.
- **Favorites**: Mark/unmark countries as favorites and view them separately.
- **Responsive Design**: Mobile-friendly layout using Tailwind CSS.

---

##  Tech Stack

- **Frontend**: React, React Router, Axios
- **Styling**: Tailwind CSS
- **State & Utilities**: React Context, Lodash (debounce)
- **Auth/Storage**: LocalStorage (simulated auth)
- **Hosting**: Vercel

---

## Getting Started

### Prerequisites
- Node.js 
- npm 

### Installation
git clone <repo-url>
cd json-land
npm install
npm start

### Testing
Run the tests with:

npm test