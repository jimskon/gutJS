# MakeFile to deploy the Sample US CENSUS Name Data 
# server using Python Microservice
# For MATH318 Software Development

all: PutHTML

PutHTML:
	cp gut.html /var/www/html/gutJS/
	cp gut.css /var/www/html/gutJS/
	cp gut.js /var/www/html/gutJS/

	echo "Current contents of your HTML directory: "
	ls -l /var/www/html/gutJS

