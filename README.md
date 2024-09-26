<h1 align="center" style="font-weight: bold;">My Web Storage 💻</h1>

<p align="center">
 <a href="#tech">Technologies</a> • 
  <a href="#routes">API Endpoints</a> •
</p>

<p align="center">
    <b>This repo includes both frontend and backend services to allow users to deploy their own server at home and save files to a directory of their choosing. I personally created this for my own use and hosting on a raspberry pi!</b>
</p>

<h2 id="technologies">💻 Technologies</h2>

- Angular17
- ASP.NET WEB API
- Tailwind

<h2 id="routes">📍 API Endpoints</h2>
​
| route               | description                                          
|----------------------|-----------------------------------------------------
| <kbd>GET /api/GetAllPhotos</kbd>     | retrieves all photos in specified directory set in backend variable see [response details](#get-all-photos)
| <kbd>GET /api/GetPhotoFile</kbd>     | retrieves specified photo based on file path see [request details](#get-photo-file)
| <kbd>POST /api/AddPhoto</kbd>     | adds photo to specified directory see [request details](#add-photo)

<h3 id="get-all-photos">GET /api/GetAllPhotos</h3>

**RESPONSE**
```json
{
  "fileName": "Capture.png",
  "fileLength": 19283
}
```

<h3 id="get-all-photos">GET /api/GetAllPhotos</h3>

**RESPONSE**
```json
{
  "fileName": "Capture.png",
  "fileLength": 19283
}
```

<h3 id="add-photo">GET /api/GetPhotoFile</h3>

**REQUEST**
```json
{
  "file": "C:/DCIM/Dog-19230.jpg",
}
```

<h3>Documentations that might help</h3>

[📝 How to create a Pull Request](https://www.atlassian.com/br/git/tutorials/making-a-pull-request)

[💾 Commit pattern](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716)
