# COMP-4513-A1

## Overview

## Built With

**Node.js** - JS runtime

**Express** - JS API framework

**Supabase** - Database hosting

**Render** - For deployment <https://comp-4513-a1-hi9r.onrender.com>

## API Endpoints

| Endpoint | Description |
| :--- | :--- |
| **Eras** | |
| `/api/eras` | Returns all eras |
| **Galleries** | |
| `/api/galleries` | Returns all galleries |
| `/api/galleries/:ref` | Returns a specific gallery by gallery ID |
| `/api/galleries/country/:substring` | Returns galleries where country starts with substring (case-insensitive) |
| **Artists** | |
| `/api/artists` | Returns all artists |
| `/api/artists/:ref` | Returns a specific artist by artist ID |
| `/api/artists/search/:substring` | Searches artists by last name starting with substring |
| `/api/artists/country/:substring` | Searches artists by nationality starting with substring |
| **Genres** | |
| `/api/genres` | Returns all genres along with their era details |
| `/api/genres/:ref` | Returns a specific genre by genre ID with its era |
| `/api/genres/painting/:ref` | Returns all genres associated with a specific painting ID |
| **Paintings** | |
| `/api/paintings/single/:ref` | Returns a single painting by painting ID with artist and gallery details |
| `/api/paintings/sort/:field/limit/:limit` | Sorts paintings by `title` or `year`, limited to `:limit` records (0 for all) |
| `/api/paintings/sort/:field/limit/:limit/skip/:skip` | Sorts paintings by `title` or `year` with skip & limit |
| `/api/paintings/search/:substring` | Searches paintings containing substring in title, sorted by year |
| `/api/paintings/years/:start/:end` | Returns paintings between `:start` and `:end` years, sorted by year |
| `/api/paintings/galleries/:ref` | Returns paintings in a gallery by gallery ID, sorted by year |
| `/api/paintings/artist/:ref` | Returns paintings by an artist by artist ID, sorted by year |
| `/api/paintings/genre/:ref` | Returns paintings in a genre | `/api/paintings/genre/76` |
| `/api/paintings/era/:ref` | Returns paintings in an era | `/api/paintings/era/2` |
| **Counts** | |
| `/api/counts/genres` | Returns painting count for each genre (fewest to most) |
| `/api/counts/artists` | Returns painting count for each artist (most to fewest) |
| `/api/counts/topgenres/:ref` | Returns genres with more than `:ref` paintings (most to fewest) |

## Project Files

**index.js** - Express App start point.

**supabaseClient.js** - Queries the DB for API endpoints.

**/routes/** - API Endpoints.

## Test Links

- <https://comp-4513-a1-hi9r.onrender.com/api/galleries/country/fra>
- <https://comp-4513-a1-hi9r.onrender.com/api/paintings/sort/year/limit/10/skip/30>
- <https://comp-4513-a1-hi9r.onrender.com/api/paintings/sort/year/limit/10/skip/30000>
- <https://comp-4513-a1-hi9r.onrender.com/api/paintings/years/1800/1850>
- <<https://comp-4513-a1-hi9r.onrender.com/api/counts/topgenres/20>
