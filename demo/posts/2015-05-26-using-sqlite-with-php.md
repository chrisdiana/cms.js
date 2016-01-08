---
layout: post
title: Using SQLite with PHP
tags: [sqlite, php]
---

SQLite is a serverless, configuration-free and reliable database engine used on
everything from iPods to Mobile apps. It can also be used for small web
applications as well. With SQLite, you can get an application up and running
without worrying about a full blown MySQL or PostgreSQL server install...and
best of all it can be easily backed up or put into version control.

Here we are going to use SQLite with PHP using PHP's built in `PDO` function.

Start off by moving to your project directory and then create a new SQLite
database in terminal:

```
sqlite3 db.sqlite
```

SQLite will now open. Create a new database:

```
CREATE TABLE garage(
	id INTEGER PRIMARY KEY,
	year INT(4) NOT NULL,
	make VARCHAR(255) NOT NULL,
	model VARCHAR(255) NOT NULL
);
```

Now type `.schema` to verify you table is created. You should see the database
schema. Let's insert some values into the database:

```
INSERT INTO garage(year, make, model) VALUES
    (1991, 'Ferrari', 'Testarossa'),
	(1994, 'Acura', 'NSX'),
	(1992, 'Toyota', 'Corolla');
```

Finally, query the database to make sure all the values were inserted:

```
SELECT * FROM garage;
```

Exit SQLite using the `.exit` command. You should now see the `db.sqlite` file
created in your current working directory.

#### Selecting data from SQLite in PHP

Now we are going to select some data from the SQLite database using PHP's built
in PDO function. Create a new PHP file and use this function to connect using
PDO:

```
// General database query
function dbQuery($sql)
{
	// set PDO for SQLite
	$db = new PDO("sqlite:db.sqlite");
	// set the params to query
	$params = ['year', 'make', 'model'];

	// query the database using the sql from the parameter
	foreach($db->query($sql) as $row)
	{
		// loop through the parameters given in the function
		// to only get those with the right key
		foreach($params as $param)
		{
			$objectParams[$param] = $row[$param];
		}
		// store the object params in an objects array
		$objects[] = $objectParams;
		// clear out the params array for next loop
		$objectParams = null;
	}
	$db = null;

	return $objects;
}
```

You can read through the comments of the function to see how it all works, but basically what happens
here is the function queries the database and loops through looking for the specified parameters.

Next, lets create a function that will get all the cars in the database. Just below the `dbQuery` function,
add this:

```
function getAllCars()
{
	$sql = "SELECT * FROM garage";
	$cars = dbQuery($sql);
	return $cars;
}
```

Here we are calling our `dbQuery` function using the select all statement as our function parameter. Now
if we add this just below our `getAllCars` function and run the PHP file, the output should show all the
cars in the database:

```
$cars = getAllCars();
var_dump($cars);
```

We'll add one more function in order to narrow down our search, a query by param function:

```
function getCarsByParam($param, $search=NULL)
{
	if($search)
	{
		$sql = "SELECT * FROM garage WHERE " . $param .  "  LIKE '%" . $search . "%'";
	}
	else
	{
		$sql = "SELECT * FROM garage WHERE " . $param";
	}
	$cars = dbQuery($sql);
	return $cars;
}
```

Here we will be searching the database for a term like the `$search` term and a param like the `$param`. Add this
below the `getCarsByParam` function to test it out:

```
$cars = getCarsByParam('year', '1991');
var_dump($cars);
```

That about wraps it up for a nice intro to using PHP with SQLite. Make sure to take a look at the [links](http://codoki.github.io/links/) page
for further reading and resources.
