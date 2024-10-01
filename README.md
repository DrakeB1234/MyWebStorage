<h1 align="center" style="font-weight: bold;">My Web Storage 💻</h1>

<p align="center">
 <a href="#tech">Technologies</a> • 
  <a href="#routes">API Endpoints</a>
</p>

<p align="center">
    <b>This repo includes both frontend and backend services to allow users to deploy their own server at home and save files to a directory of their choosing. I personally created this for my own use and hosting on a raspberry pi!</b>
</p>
<hr>
<h2 id="technologies">💻 Technologies</h2>

- Angular 18
- ASPNET WEB API
- Tailwind

<hr>
<h2 id="routes">📍 API Endpoints</h2>
<p align="center">
  <a href="#getting-files">Getting Files</a> • 
  <a href="#posting-files">Posting Files</a> •
  <a href="#getting-files">Getting Folders</a> •
  <a href="#posting-folders">Posting Folders</a>
</p>
​
<h4 id="getting-files">Getting Files</h4> 

<code>/api/GetAllFilePaths</code> 
<sub>Returns a list of all file paths in root directory</sub>

<details>
 <summary><code>GET</code></summary>

##### Parameters

> None

##### Responses

> | http code     | content-type                             | response                                                            |
> |---------------|------------------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json; charset=utf-8`        | String[] FilePaths                                |
> | `400`         | `application/json`                       | `{"code":"400","message":"Bad Request"}`                            |

</details><br>

<code>/api/GetImage/{path}</code> 
<sub>Returns an image based on the path in param (Used in html to retrieve image from server)</sub>

<details>
 <summary><code>GET</code></summary>

##### Parameters

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | Path      |  required | string   | path of the file recieved from the endpoint 'GetAllFilePaths'  |

##### Responses

> | http code     | content-type                             | response                                                            |
> |---------------|------------------------------------------|---------------------------------------------------------------------|
> | `200`         | `image/{extension}`        | File Image                                |
> | `400`         | `application/json`                       | `{"code":"400","message":"Bad Request"}`                            |

</details><br>

<h4 id="posting-files">Posting Files</h4> 

<code>/api/AddFiles</code> 
<sub>Add a list of files into the directory specified (If no path provided, then root is assumed)</sub>

<details>
 <summary><code>POST</code></summary>

##### Parameters

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | Path      |  not required | string   | path to upload images into based from root  |
> | Files      |  required | FileList   | List of files from form data  |

##### Responses

> | http code     | content-type                             | response                                                            |
> |---------------|------------------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json; charset=utf-8`        | `{"code":"200","message":"All files successfully uploaded to {path}"}`                               |
> | `400`         | `application/json`                       | `{"code":"400","message":"Bad Request"}`                            |

</details><br>

<h4 id="getting-folders">Getting Folders</h4> 

<code>/api/GetAllDirectories</code> 
<sub>Returns a list of folders in specified directory</sub>

<details>
 <summary><code>GET</code></summary>

##### Parameters

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | Path      |  not required | string   | path to recieve directories from, assumes 'root' if none is provided  |

##### Responses

> | http code     | content-type                             | response                                                            |
> |---------------|------------------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json`        | `{ FolderName: "" }[]`                              |
> | `400`         | `application/json`                       | `{"code":"400","message":"Bad Request"}`                            |

</details><br>

<h4 id="posting-folders">Posting Folders</h4> 

<code>/api/AddDirectory</code> 
<sub>Adds a folder in specified directory</sub>

<details>
 <summary><code>POST</code></summary>

##### Parameters

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | Folder Name      |  required | string   | Name of the folder  |
> | Folder Path      |  not required | string   | path to add folder to, assumes 'root' if none is provided  |

##### Responses

> | http code     | content-type                             | response                                                            |
> |---------------|------------------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json`        | `{"code":"200","message":"Folder added successfully to {path}"}`                             |
> | `400`         | `application/json`                       | `{"code":"400","message":"Bad Request"}`                            |

</details><br>

<hr>

<h3>Documentations that might help</h3>

[📝 How to create a Pull Request](https://www.atlassian.com/br/git/tutorials/making-a-pull-request)

[💾 Commit pattern](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716)
