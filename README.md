# Url Shortener Microservice

API that lets you provide a regular url like http(s)://www.example.com(/more/routes) and returns a shortened version of it.

**Examples:**


* When using *POST /api/shorturl/new*, you 
will provide a specific URL within the request body
   ```
    {
      "original_url": "https://www.example.com"
    }
   ```
  You will get a response body like the following:

   ```
    {
      "original_url": "https://www.example.com",
      "short_url": 1
    }
   ```
  The **short_url** property is unique. If you try to post the same URL more than once, you will get the same value for that property.

  This unique id property is also incremental, meaning that for each different url, you will get the next available number for it.
When executing the *POST /api/shorturl/new* requst that has a body like

   ```
    {
      "url": "https://www.example.com"
    }
   ```

  you will get a **short_url** of '1' (assuming that it is the first request on this API). After that, if you post a different URL, like *https://www.example2.com*, you will get a **short_url** property with a value of '2'. The value is of type *number*, not *string*.

* When calling *GET /api/shorturl/{short_url}*, assuming that the URL you provided within the post request is valid, you will be redirected to that specific site.

* When trying to call the *POST /api/shorturl/new* endpoint, while providing gibberish, or a URL with an invalid format within the request body, you will get the following response: 

   ```
    {
      "error": "invalid URL"
    }
   ```

* When trying to call the *POST /api/shorturl/new* endpoint, while providing a valid URL that does not exist on the Internet, you will get the following response: 

   ```
    {
      "error": "invalid Hostname"
    }
   ```

* When trying to call the *GET /api/shorturl/:id* endpoint using a non-existent **short_url**, you will get the following response: 

   ```
    {
      "error": "No short url found for given input"
    }
   ```

## Getting Started

These instructions will get you a copy of the project up and running on your local machine.

### Prerequisites

You need to have ***git***, ***yarn***, ***nodejs*** and ***mongodb*** installed on your computer.

### Installation steps

```
> git clone git@github.com:narcisneacsu194/url-shortener-microservice.git
> cd {your_local_path}/url-shortener-microservice
> yarn install
> cd {your_local_path}/mongodb/bin
> ./mongod --dbpath {path_of_mongo_data_folder}
> node server.js
```

You can then access the application with any browser or with software like Postman, using the following URL:

```
localhost:3000
```
