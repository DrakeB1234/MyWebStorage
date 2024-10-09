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
  <a href="#file-endpoints">File Endpoints</a> • 
  <a href="#folder-endpoints">Folder Endpoints</a> •
  <a href="#auth-endpoints">Auth Endpoints</a>
</p>
​
<h4 id="file-endpoints">File Endpoints</h4> 

<code>/api/GetAllFilePaths/{path}</code> 
<sub>Returns a list of all file paths in root directory</sub>

<details>
 <summary><code>GET</code></summary>

##### Parameters

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | Path      |  required | string   | path of the file recieved from the endpoint 'GetAllFilePaths'  |


##### Responses

> | http code     | content-type                             | response                                                            |
> |---------------|------------------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json; charset=utf-8`        | String[] FilePaths                                |
> | `400`         | `application/json`                       | `{"code":"400","message":"Bad Request"}`                            |

</details><br><br>

<code>/api/Files/GetCompressedImage/{path}</code> 
<sub>Returns an compressed, cached image based on the path in param (Used in html to retrieve image from server)</sub>

<details>
 <summary><code>GET</code></summary>

##### Parameters

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | Path      |  required | string   | path of the directory to get files from  |

##### Responses

> | http code     | content-type                             | response                                                            |
> |---------------|------------------------------------------|---------------------------------------------------------------------|
> | `200`         | `image/{extension}`        | File Image                                |
> | `400`         | `application/json`                       | `{"code":"400","message":"Bad Request"}`                            |

</details><br><br>

<code>/api/Files/DownloadFile/{downloadPath}</code> 
<sub>Returns an full quality image based on the path in param (Used to later download on client side)</sub>

<details>
 <summary><code>GET</code></summary>

##### Parameters

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | DownloadPath      |  required | string   | path of the file to be downloaded  |

##### Responses

> | http code     | content-type                             | response                                                            |
> |---------------|------------------------------------------|---------------------------------------------------------------------|
> | `200`         | `image/{extension}`        | File Image                                |
> | `400`         | `application/json`                       | `{"code":"400","message":"Bad Request"}`                            |

</details><br><br>

<code>/api/Files/AddFile</code> 
<sub>Add a file into the directory specified (If no path provided, then root is assumed)</sub>

<details>
 <summary><code>POST</code></summary>

##### Parameters

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | Path      |  not required | string   | path to upload images into based from root  |
> | Files      |  required | File   | File from form data  |

##### Responses

> | http code     | content-type                             | response                                                            |
> |---------------|------------------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json; charset=utf-8`        | `{"code":"200","message":"File successfully uploaded to {path}"}`                               |
> | `400`         | `application/json`                       | `{"code":"400","message":"Bad Request"}`                            |

</details><br><br>

<code>/api/Files/MoveFile</code> 
<sub>Move a file into the directory specified (If no path provided, then root is assumed)</sub>

<details>
 <summary><code>PATCH</code></summary>

##### Parameters

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | Path      |  not required | string   | path to upload images into based from root  |
> | Files      |  required | String   | Name of the file  |

##### Responses

> | http code     | content-type                             | response                                                            |
> |---------------|------------------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json; charset=utf-8`        | `{"code":"200","message":"File moved successfully to {path}"}`                               |
> | `400`         | `application/json`                       | `{"code":"400","message":"Bad Request"}`                            |

</details><br><br>

<code>/api/Files/DeleteFile/{fileName}</code> 
<sub>Deletes a file from the provided path</sub>

<details>
 <summary><code>DELETE</code></summary>

##### Parameters

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | fileName      |  required | string   | path of the file to be deleted  |

##### Responses

> | http code     | content-type                             | response                                                            |
> |---------------|------------------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json; charset=utf-8`        | `{"code":"200","message":"File deleted successfully"}`                               |
> | `400`         | `application/json`                       | `{"code":"400","message":"Bad Request"}`                            |

</details><br><br>

<h4 id="folder-endpoints">Folder Endpoints</h4> 

<code>/api/Folders/GetAllDirectories</code> 
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

</details><br><br>

<code>/api/Folders/AddDirectory</code> 
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

</details><br><br>

<h4 id="auth-endpoints">Auth Endpoints</h4> 

<code>/api/Auth/Signin</code> 
<sub>Send signin details, returns a JWT after successful signin</sub>

<details>
 <summary><code>POST</code></summary>

##### Parameters

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | Username      |  required | string   | Clients username  |
> | Password      |  required | string   | Clients password  |


##### Responses

> | http code     | content-type                             | response                                                            |
> |---------------|------------------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json`        | `{ token: "" }`                              |
> | `400`         | `application/json`                       | `{"code":"400","message":"Bad Request"}`                            |
> | `401`         | `application/json`                       | `{"code":"401","message":"Invalid credientials"}`                            |

</details><br><br>

<code>/api/Auth/Authenticate</code> 
<sub>Used to ensure that client is authed, simply making a req to this endpoint will determine this</sub>

<details>
 <summary><code>GET</code></summary>

##### Parameters

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | None      |  required | string   | Clients username  |


##### Responses

> | http code     | content-type                             | response                                                            |
> |---------------|------------------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json`        | `{ token: "" }`                              |
> | `400`         | `application/json`                       | `{"code":"400","message":"Bad Request"}`                            |
> | `401`         | `application/json`                       | `{"code":"401","message":"Invalid credientials"}`                            |

</details><br><br>

<hr>

<h3>Documentations that might help</h3>

[📝 How to create a Pull Request](https://www.atlassian.com/br/git/tutorials/making-a-pull-request)

[💾 Commit pattern](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716)
