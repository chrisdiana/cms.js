---
layout: post
title: Getting Started with Slim Framework
tags: [php, framework, mvc, rest, api, slim]
---

Here's a quick tutorial to get up and running with Slim PHP Framework to start building
RESTful applications.

**Why a REST API?**

A REST API acts like a middle-man between clients (mobile devices, computers) and the database server.
This type of infrastructure allows clients using completely different technologies
or operating systems to communicate in one type of protocol. That way as technologies
change, the method of communication with the database and server logic can remaind
the same. Just remember, the application we are building is meant to be used
with client applications and not really meant for actual users to be using it...
so it's not going to look very pretty. We will be building [a nice looking client
application later](http://codoki.com/2015/03/20/getting-started-with-slim-framework-pt-2/) that will be used to interact with the API--and that will look pretty.

**Why use Slim?**

Slim is a micro framework for PHP that allows you to quickly build web applications and APIs.
I like Slim because it's super lightweight (only about 283kb for the entire framework) as
opposed to larger PHP frameworks like Codeigniter and Symfony, which have a lot of extra fluff.
This means that's it really fast, and great for building a REST API for use on a multitude of
devices.

### 1. Install

You can start by downloading it [here](https://github.com/codeguy/Slim) and
extract the Slim framework into your project directory.

### 2. Create a database

Login into MySQL and create a new database to have our Slim application interact
with.

```
CREATE DATABASE garage;
USE garage;
CREATE TABLE cars (
	id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	year INT(4) NOT NULL, make VARCHAR(30) NOT NULL,
	model VARCHAR(40) NOT NULL
);
```

Insert some sample data into the database.

```
INSERT INTO cars (year, make, model) VALUES
	(1991, 'Ferrari', 'Testarossa'),
	(1994, 'Acura', 'NSX'),
	(1992, 'Toyota', 'Corolla');
```

### 3. Download NotORM

We are also going to use a plugin called [NotORM](http://www.notorm.com/)
that will make working with the database easier. Create a `plugins` folder in your
project directory and place the downloaded NotORM plugin inside it. Your directory
should look like this:

```
- .htaccess
- index.php
- Slim/
- plugins/
- - NotORM/
- - NotORM.php
```

### 4. Remove and replace index.php

Now, just delete the included `index.php` and create a new one as were are going
to going through it step by step. In your `index.php` file add this lines. This
will require the framework, register the autoloader and instantiate the Slim
application. Also, we are requiring the NotORM library for handling the database.

```
/* Require Slim and plugins */
require 'Slim/Slim.php';
require 'plugins/NotORM.php';

/* Register autoloader and instantiate Slim */
\Slim\Slim::registerAutoloader();
$app = new \Slim\Slim();
```

### 5. NotORM Database Configuration

We need to setup the NotORM library so it can talk with the database:

```
/* Database Configuration */
$dbhost   = 'localhost';
$dbuser   = 'root';
$dbpass   = '';
$dbname   = 'garage';
$dbmethod = 'mysql:dbname=';

$dsn = $dbmethod.$dbname;
$pdo = new PDO($dsn, $dbuser, $dbpass);
$db = new NotORM($pdo);
```

### 6. Setup our first Route

Now we are going to setup a HTTP GET route for the home URL. In this step, we
will actually be able to start to see our application work. Below the database
configuration add:

```
/* Routes */
$app->get('/', function(){
    echo 'Home - My Slim Application';
});

/* Run the application */
$app->run();
```

If you visit `http://localhost/slim-cars/` you should now see your home message
from above.

We have the Slim application working, so now we are going to setup routes for
RESTful Web Services, using GET, PUT, POST and DELETE to handle
CRUD (Create, Read, Update, Delete) operations.

### 7. Getting the Cars

Now that we have our Slim app up and running, we need to get items from the
database. We are going to create a new route so that when a user (or device) hits
your base url and then `/cars`, it will return a list of all cars in the database in
JSON format. Right below your `home` route (and above the `$app->run()`) add:

```
// Get all cars
$app->get('/cars', function() use($app, $db){
    $cars = array();
    foreach ($db->cars() as $car) {
        $cars[]  = array(
            'id' => $car['id'],
            'year' => $car['year'],
            'make' => $car['make'],
            'model' => $car['model']
        );
    }
    $app->response()->header("Content-Type", "application/json");
    echo json_encode($cars, JSON_FORCE_OBJECT);
});
```

Here is what happens: First, we tell Slim we are setting up a HTTP GET Route
`/cars`. We add paramaters `$app` and `$db` to tell Slim to use the Slim app and
NotORM database library. We then create an empty cars array and loop through the
database getting all cars. Finally, we set the repsonse header to JSON and echo
the cars array as a JSON object. If you hit `http://localhost/slim-cars/cars` in
your browser, you should now see all the cars in the database as JSON.

Alternatively , we can use cURL to test the GET request. Pull up your terminal
and type:

```
curl -i -X GET http://localhost/slim-cars/cars
```

You should get a response similar to this:

```
HTTP/1.1 200 OK
Date: Wed, 18 Feb 2015 14:24:19 GMT
Server: Apache/2.4.9 (Unix) PHP/5.5.14
X-Powered-By: PHP/5.5.14
Content-Length: 189
Content-Type: application/json

{"0":{"id":"1","year":"1991","make":"Ferrari","model":"Testarossa"},"1":{"id":"2","year":"1994","make":"Acura","model":"NSX"},"2":{"id":"3","year":"1992","make":"Toyota","model":"Corolla"}}
```


### 8. Getting A Single Car

We've setup a route to get all the cars, but what if we just want a single car?
We'll follow a similar structure as above:

```
// Get a single car
$app->get('/cars/:id', function($id) use ($app, $db) {
    $app->response()->header("Content-Type", "application/json");
    $car = $db->cars()->where('id', $id);
    if($data = $car->fetch()){
        echo json_encode(array(
            'id' => $data['id'],
            'year' => $data['year'],
            'make' => $data['make'],
            'model' => $data['model']
        ));
    }
    else{
        echo json_encode(array(
            'status' => false,
            'message' => "Car ID $id does not exist"
        ));
    }
});
```

Similar to getting all the cars, we create a GET Route but this time we have a
callback argument `:id` added after `cars/`. This id is passed into the function
and then reads the cars from the database, finding only the car that matches the
id. Then, it encodes the result into JSON format and echos it back. If the car id
doesn't exist, it returns an error message.

Now let's test it out using cURL:

```
curl -i -X GET http://localhost/slim-cars/cars/1
```

You should get back:

```
HTTP/1.1 200 OK
Date: Wed, 18 Feb 2015 14:24:37 GMT
Server: Apache/2.4.9 (Unix) PHP/5.5.14
X-Powered-By: PHP/5.5.14
Content-Length: 62
Content-Type: application/json

{"id":"1","year":"1991","make":"Ferrari","model":"Testarossa"}
```

### 9. Adding a Car

We retrieved cars from the database, but what about adding a new one? We will be
using the POST web service to signal creation of a new car in the database. To
do this, let's add this below the `Get a single car` route:

```
// Add a new car
$app->post('/car', function() use($app, $db){
    $app->response()->header("Content-Type", "application/json");
    $car = $app->request()->post();
    $result = $db->cars->insert($car);
    echo json_encode(array('id' => $result['id']));
});
```

Let's use cURL to try adding a new car.

```
curl -X POST -d "year=1981&make=DeLorean&model=DMC-12" http://localhost/slim-cars/car
```

If you log back into MySQL, you should now see your new car added to the database.

### 10. Updating a Car

Now we are going to add an UPDATE route in order to edit current cars in the
database. To do this, we are going to be using the PUT method:

```
// Update a car
$app->put('/car/:id', function($id) use($app, $db){
    $app->response()->header("Content-Type", "application/json");
    $car = $db->cars()->where("id", $id);
    if ($car->fetch()) {
        $post = $app->request()->put();
        $result = $car->update($post);
        echo json_encode(array(
            "status" => (bool)$result,
            "message" => "Car updated successfully"
            ));
    }
    else{
        echo json_encode(array(
            "status" => false,
            "message" => "Car id $id does not exist"
        ));
    }
});
```

Similar to getting a single car, we are using a callback argument `:id` to tell
the application which car we want to edit. We then grab the car with the correct
id from the database and update it. If the update was successful, we'll echo a
success message. If the car doesn't exist, well echo that the car doesn't exist.

We can test this out using cURL PUT method in terminal:

```
curl -X PUT -d "year=2015&make=Lamborghini&model=700-4" http://localhost/slim-cars/car/3
```

### 11. Removing a Car

The last thing we need to be able to do is remove a car. We are going to be using
the DELETE method to remove cars. Here's how we are going to setup our DELETE route:

```
// Remove a car
$app->delete('/car/:id', function($id) use($app, $db){
    $app->response()->header("Content-Type", "application/json");
    $car = $db->cars()->where('id', $id);
    if($car->fetch()){
        $result = $car->delete();
        echo json_encode(array(
            "status" => true,
            "message" => "Car deleted successfully"
        ));
    }
    else{
        echo json_encode(array(
            "status" => false,
            "message" => "Car id $id does not exist"
        ));
    }
});
```

Similar to above, we are using the callback argument to get a specific car by their
id. Then, we find that car in the database and delete it using NotORM's `delete()`
method. We will then echo back a message if the car was successfully deleted, or if
the car does not exist.

We can test out this functionality using cURL DELETE:

```
curl -i -X DELETE http://localhost/slim-cars/car/4
```

### Conclusion

We'll there you have it, we have just built a RESTful application that can be used to GET, POST,
PUT and DELETE items from the database. This is a great starting point and can be
expanded to include more methods, routes, and even authentication.

You can download the source of this app in a step by step (in GIT) version on [Github](https://github.com/cdmedia/slim-cars).

The next step in this tutorial is to create a client that will communicate with
this REST API that we've just built - [Getting Started with Slim Framework - Part 2](http://codoki.com/2015/03/20/getting-started-with-slim-framework-pt-2/)



---
Other Resources

* [Slim Documentation](http://docs.slimframework.com)
* [RESTful services with jQuery, PHP and the Slim Framework](http://coenraets.org/blog/2011/12/restful-services-with-jquery-php-and-the-slim-framework/)
* [Writing a RESTful Web Service with Slim](http://www.sitepoint.com/writing-a-restful-web-service-with-slim/)
* [Taming Slim 2.0](http://code.tutsplus.com/tutorials/taming-slim-20--net-30669)
* [How to organize a large slim application](http://www.slimframework.com/news/how-to-organize-a-large-slim-framework-application)
* [cURL Docs](http://curl.haxx.se/docs/)
