# HBD Lens

Welcome to HBD Lens, a cutting-edge project crafted by the ingenious minds of Haikal, Bana, and Dewo (Hence called HBD) from the Bandung Institute of Technology. This was made to fullfill the final task of inear algebra and geometry course. This project, a reverse image query utilizing Content-Based Image Retrieval (CBIR) technology. This project is fully open source and can be accessed by this [link](https://github.com/dewodt/Algeo02-22011).

## Table of Contents

- [General Info](#general-information)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Screenshots](#screenshots)
- [Setup](#setup)
- [Usage](#usage)
- [Project Status](#project-status)
<!-- * [License](#license) -->

## General Information

- HBD Lens is a reverse image query utilizing Content-Based Image Retrieval (CBIR) technology.
- In the digital era, the number of images produced and stored is increasing rapidly, both in personal and professional contexts. Image retrieval systems become very relevant and important in facing this challenge.
- With the help of image retrieval system, users can easily search, access and manage their image collection.

## Technologies Used

- Next.js - v14.0.1 (Fullstack Framework)
- Nodejs - v20.9.0 (JavaScript Runtime)
- TailwindCSS -v3.3.0 (CSS Library)
- shadcn/ui - vN/A (UI Library)
- sharp - v0.32.6 (Image Processing)
- zod - v3.22.4 (Schema Validation)
- react-hook-form - v(7.47.0) (Form Hooks)
- react-pdf/renderer - v3.1.14 (Render PDF)
- jsdom - v22.1.0 (Convert String to DOM)
- react-webcam - v7.2.0 (Webcam Hooks)

## Features

- Reverse image search by uploading your image query or you can also use webcam!
- You can upload a folder of dataset or you can also insert an url to scrape!
- Compare input & dataset by color or texture!
- See the results with pagination or you can also download the pdf!
- Reponsive & light/dark mode available!

## Screenshots

![Landing Page](/img/readme/landing-page.png)
![Search Menu Page](/img/readme/search-menu-page.png)
![Search by Upload Data Set Page](/img/readme/search-upload-data-set-page.png)
![Search by Scrape Data Set Page](/img/readme/search-scrape-data-set-page.png)
![How To Use Page](/img/readme/how-to-use-page.png)
![About Page](/img/readme/about-page.png)

## Setup

**IMPORTANT NOTES:**

**1. This project must be run on localhost for better experience because free hosting service such as Vercel limits 4.5 MB payload for serverless functions ([source](https://vercel.com/docs/functions/serverless-functions/runtimes#request-body-size)).**

**2. Make sure to have Node.js v.20.x.x installed (see github [issue](https://github.com/colinhacks/zod/issues/387#issuecomment-1774603011)).**

To run this project, clone this repository

```bash
git clone https://github.com/dewodt/Algeo02-22011.git
```

Go to `/src` directory

```bash
cd src
```

Install node modules (especially for first time using)

```bash
npm install
```

Build the project by running (note that building the project is much smoother and faster than running `npm run dev`)

```bash
npm run build
```

Start the project by running

```bash
npm run start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

OR you can also add `--turbo` argument to use turborepo. For example,
```bash
npm run build --turbo
```
and
```bash
npm run start --turbo
```

To use this project, you can read [How To Use](http://localhost:3000/how-to-use).

## Usage

This app works similarly like Google Lens. Let's say you have a dataset of images or a link to a website that contains images. You also have an image that you want to reverse search & find the similarity. All you have to do is run this app, upload your images, pick the calculation method (color or texture) then click search! For more information, you can run this app and read [How To Use](http://localhost:3000/how-to-use).

## Project Status

Project is: _complete_.
