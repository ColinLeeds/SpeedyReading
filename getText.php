<?php
	$con = new PDO("mysql:host=localhost;dbname=SpeedyReading", "SpeedyAdmin", "FvAc3MiMi8PU");
	
	$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	
	$result = $con->query('select * from ReadingText ORDER BY RAND() LIMIT 0,1');
	
	$result->setFetchMode(PDO::FETCH_ASSOC);
	
	/*is there some way I can select a random row?*/
	foreach($result as $row)
	{
		foreach($row as $name=>$value)
		{
			if($name == "readingText")
			{
				print "$value";
			}
			if($name == "olid")
			{
				print "~~$value";
			}
		}
	}
?>